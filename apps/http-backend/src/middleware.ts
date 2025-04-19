import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req:Request,res:Response,next:NextFunction){
    const token = req.headers["authorization"] ?? "";
    const decoded = jwt.verify(token,JWT_SECRET);
    if(decoded){
        //how can you update the structure of the request object in express
        //@ts-ignore
        req.userId = decoded.UserId;
        next();
    }
    else{
        res.status(403).json({
            message : "Unauthorized"
        }
        )
    }
}