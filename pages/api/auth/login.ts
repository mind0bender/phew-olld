import { isObjectIdOrHexString, ObjectId } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import user, { UserInterface } from "../../../database/models/user";
import Response from "../../../helpers/response";
import { shareableUser } from "../../../helpers/shareableModel";
import dbConnect from "../../../lib/dbconnect";
import validator from "validator";
import { sign } from "../../../lib/jwt";
import login from "../../../controllers/auth/login.controller";

const { isEmpty } = validator;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
): Promise<void> {
  return new Promise(
    (resolve: (value?: any) => void, reject: (reason?: any) => void): any => {
      switch (req.method) {
        case "POST":
          const _id: string | undefined = req.cookies._id;
          console.log("_id from header", _id);
          let { username, password }: { username: string; password: string } =
            req.body;
          login({ _id, username, password }).then(({ data, status }) => {
            res.status(status).send(data);
          });
          break;
        default:
          return resolve(res.status(404).end());
          break;
      }
    }
  );
}
