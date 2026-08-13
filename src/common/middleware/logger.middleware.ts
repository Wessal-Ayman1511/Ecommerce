import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";


@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {

        // console.log(
        //     `${Date.now()}, req method is ${req.method}, req url is ${req.url} from ip :${req.ip}`
        // )
        next()
    }
}