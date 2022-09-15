import * as express from "express";
import * as cors from "cors";
import IConfig from "./common/IConfig.interface";
import { DevConfig } from "./configs";
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from "mysql2/promise";
import fileUpload = require("express-fileupload");
import AddressService from "./components/user/AddressService.service";
import AdministratorService from "./components/administrator/AdministratorService.service";
import UserService from "./components/user/UserService.service";
import CountryService from "./components/country/CountryService.service";
import AircraftService from "./components/aircraft/AircraftService.service";
import BagService from "./components/bag/BagService.service";
import CabinService from "./components/cabin/CabinService.service";

async function main() {
  const config: IConfig = DevConfig;

  let db = await mysql2.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    charset: config.database.charset,
    timezone: config.database.timezone,
    supportBigNumbers: config.database.supportBigNumbers,
  });

  function attactConnectionMonitoring(db: mysql2.Connection) {
    db.on("error", async (error) => {
      if (!error.fatal) {
        return;
      }

      if (error?.code !== "PROTOCOL_CONNECTION_LOST") {
        throw error;
      }

      console.log("Reconnecting to the database server...");

      db = await mysql2.createConnection(db.config);

      attactConnectionMonitoring(db);

      db.connect();
    });
  }

  attactConnectionMonitoring(db);

  const applicationResources: IApplicationResources = {
    databaseConnection: db,
    services: {
      address: null,
      administrator: null,
      aircraft: null,
      bag: null,
      cabin: null,
      country: null,
      user: null,
      /* TODO: Implement DB entity services */
    },
  };

  applicationResources.services.address = new AddressService(
    applicationResources
  );
  applicationResources.services.administrator = new AdministratorService(
    applicationResources
  );
  applicationResources.services.aircraft = new AircraftService(
    applicationResources
  );
  applicationResources.services.bag = new BagService(applicationResources);
  applicationResources.services.cabin = new CabinService(applicationResources);
  applicationResources.services.country = new CountryService(
    applicationResources
  );
  applicationResources.services.user = new UserService(applicationResources);

  const application: express.Application = express();

  application.use(cors());

  application.use(express.urlencoded({ extended: true }));

  application.use(
    fileUpload({
      limits: {
        files: config.fileUploads.maxFiles,
        fileSize: config.fileUploads.maxFileSize,
      },
      abortOnLimit: true,

      useTempFiles: true,
      tempFileDir: config.fileUploads.temporaryFileDirecotry,
      createParentPath: true,
      safeFileNames: true,
      preserveExtension: true,
    })
  );

  application.use(express.json());

  application.use(
    config.server.static.route,
    express.static(config.server.static.path, {
      index: config.server.static.index,
      dotfiles: config.server.static.dotfiles,
      cacheControl: config.server.static.cacheControl,
      etag: config.server.static.etag,
      maxAge: config.server.static.maxAge,
    })
  );

  for (const router of config.routers) {
    router.setupRoutes(application, applicationResources);
  }

  application.use((_req, res) => {
    res.sendStatus(404);
  });

  application.listen(config.server.port);
}

process.on("uncaughtException", (error) => {
  console.error("Error:", error);
});

main();
