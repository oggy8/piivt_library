import IConfig from "./common/IConfig.interface";
import { MailConfigurationParameters } from "./config.mail";
import { readFileSync } from "fs";
import "dotenv/config";


const DevConfig: IConfig = {
  server: {
    port: 10000,
    static: {
      index: false,
      dotfiles: "deny",
      cacheControl: true,
      etag: true,
      maxAge: 1000 * 60 * 60 * 24,
      path: "./static",
      route: "/assets",
    },
  },
  database: {
    host: "localhost",
    port: 3306,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "library",
    charset: "utf8",
    timezone: "+01:00",
    supportBigNumbers: true,
  },
  routers: [
    //new AdministratorRouter(),
    
  ],
  fileUploads: {
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    temporaryFileDirectory: "../temp/",
    destinationDirectoryRoot: "uploads/",
    photos: {
      allowedTypes: ["png", "jpg"],
      allowedExtensions: [".png", ".jpg"],
      width: {
        min: 320,
        max: 1920,
      },
      height: {
        min: 240,
        max: 1080,
      },
      resize: [
        {
          prefix: "small-",
          width: 320,
          height: 240,
          fit: "cover",
          defaultBackground: { r: 0, g: 0, b: 0, alpha: 1 },
        },
        {
          prefix: "medium-",
          width: 640,
          height: 480,
          fit: "cover",
          defaultBackground: { r: 0, g: 0, b: 0, alpha: 1 },
        },
      ],
    },
  },
  mail: {
    host: "smtp.gmail.com",
    port: 587,
    email: "",
    password: "",
    debug: true,
  },
  auth: {
    librarian:{
      algorithm: "RS256",
      issuer: "Singidunum University",
      tokens: {
        auth: {
          duration: 60 * 60 * 24,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
        refresh: {
          duration: 60 * 60 * 24 * 30,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
      },
    },
    student: {
      algorithm: "RS256",
      issuer: "Singidunum University",
      tokens: {
        auth: {
          duration: 60 * 60 * 24,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
        refresh: {
          duration: 60 * 60 * 24 * 30,
          keys: {
            public: readFileSync("./.keystore/app.public", "ascii"),
            private: readFileSync("./.keystore/app.private", "ascii"),
          },
        },
      },
    },
    allowAllRoutesWithoutAuthTokens: false,
  },
};

DevConfig.mail = MailConfigurationParameters;

export { DevConfig };
