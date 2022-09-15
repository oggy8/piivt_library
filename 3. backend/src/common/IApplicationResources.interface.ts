import * as mysql2 from "mysql2/promise";

export interface IServices {
  
  /* TODO: implement DB entity services */
}

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}
