import ITokenData from "../../src/components/auth/dto/ITokenData";

declare global {
  namespace Express {
    interface Request {
      authorization?: ITokenData | null;
    }
  }
}
