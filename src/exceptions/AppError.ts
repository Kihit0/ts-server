import { HttpCodes } from "src/helpers/enums/HttpStatusCode";

interface AppErrorArgs {
  name?         : string;
  httpCode      : HttpCodes;
  description   : string;
  isOperation?  : boolean;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpCodes;
  public readonly isOperation: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || "Error";
    this.httpCode = args.httpCode;

    if(args.isOperation !== undefined){
        this.isOperation = args.isOperation;
    }

    Error.captureStackTrace(this);
  }
}
