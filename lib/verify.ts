import { ObjectId } from "mongoose";
import user, { UserInterface } from "../database/models/user";
import { shareableUser } from "../helpers/shareableModel";
import dbConnect from "./dbconnect";
import validator from "validator";
import { verify } from "./jwt";

const { isEmpty } = validator;

export default function handler(token: string): Promise<void> {
  return new Promise(
    (resolve: (value?: any) => void, reject: (reason?: any) => void): void => {
      dbConnect()
        .then((): void => {
          if (token && !isEmpty(token)) {
            verify(token)
              .then((decoded: { _id: ObjectId }): void => {
                user
                  .exists({ _id: decoded._id })
                  .then((doc: { _id: ObjectId } | null): void => {
                    if (!doc) {
                      reject();
                    } else {
                      user
                        .findById(doc._id)
                        .then((userDoc: UserInterface): void => {
                          resolve(shareableUser(userDoc));
                        })
                        .catch((err: Error): void => {
                          console.log(err);
                          reject();
                        });
                    }
                  })
                  .catch((err: Error): void => {
                    console.log(err);
                    reject();
                  });
              })
              .catch((): void => {
                reject();
              });
          } else {
            reject();
          }
        })
        .catch((err: Error): void => {
          console.log(err);
          reject();
        });
    }
  );
}