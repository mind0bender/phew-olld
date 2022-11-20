import { isObjectIdOrHexString, ObjectId } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import user, { UserInterface } from "../../../database/models/user";
import Response from "../../../helpers/response";
import { shareableUser } from "../../../helpers/shareableModel";
import dbConnect from "../../../lib/dbconnect";
import validator from "validator";

const { isEmpty } = validator;

type userInfo = {
  username: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
): Promise<void> {
  return new Promise(
    (resolve: (value: any) => void, reject: (reason: any) => void): void => {
      switch (req.method) {
        case "POST":
          dbConnect()
            .then((): void => {
              const _id: string | undefined = req.cookies._id;

              if (isObjectIdOrHexString(_id)) {
                user
                  .findById(_id)
                  .then((userDoc: UserInterface): void => {})
                  .catch();
              } else {
                let {
                  username,
                  password,
                }: { username: string; password: string } = req.body;

                const errs: string[] = [];

                if (typeof username === "string") username = username.trim();
                else errs.push("Invalid `username`");
                if (typeof password === "string") password = password.trim();
                else errs.push("Invalid `passowrd`");

                if (errs.length) {
                  reject(
                    res.status(422).send(
                      new Response({
                        errors: errs,
                        msg: "Invalid Credentials:",
                      })
                    )
                  );
                } else {
                  if (isEmpty(username)) {
                    errs.push("`username` is required");
                  }
                  if (isEmpty(password)) {
                    errs.push("`password` is required");
                  } else if (
                    !validator.isLength(password, {
                      min: 4,
                      max: 16,
                    })
                  ) {
                    errs.push(
                      "`password` must be between 4 and 16 characters."
                    );
                  }

                  if (errs.length) {
                    reject(
                      res.status(422).send(
                        new Response({
                          msg: "Invalid Credentials:",
                          errors: errs,
                        })
                      )
                    );
                  } else {
                    const { username, password }: userInfo = req.body;
                    user
                      .exists({ username })
                      .then((doc: { _id: ObjectId } | null): void => {
                        if (!doc) {
                          reject(
                            res.status(401).send(
                              new Response({
                                msg: "User not found",
                                errors: ["User not found"],
                              })
                            )
                          );
                        } else {
                          user
                            .findById(doc._id)
                            .then((userDoc: UserInterface): void => {
                              userDoc
                                .validatePassword(password)
                                .then((isMatched: boolean): void => {
                                  if (!isMatched) {
                                    reject(
                                      res.status(401).send({
                                        errors: ["Incorrect password"],
                                        msg: "Incorrect password",
                                      })
                                    );
                                  } else {
                                    resolve(res.send(shareableUser(userDoc)));
                                  }
                                })
                                .catch((err: Error): void => {
                                  console.log(err);
                                  reject(
                                    res.status(500).send(
                                      new Response({
                                        errors: ["There was a problem"],
                                        msg: "There was a problem",
                                      })
                                    )
                                  );
                                });
                            })
                            .catch((err: Error): void => {
                              console.log(err);
                              reject(
                                res.status(500).send(
                                  new Response({
                                    errors: ["There was a problem"],
                                    msg: "There was a problem",
                                  })
                                )
                              );
                            });
                        }
                      })
                      .catch((err: Error): void => {
                        console.log(err);
                        reject(
                          res.status(500).send(
                            new Response({
                              errors: ["There was a problem"],
                              msg: "There was a problem",
                            })
                          )
                        );
                      });
                  }
                }
              }
            })
            .catch((err: Error): void => {
              console.log(err);
              reject(
                res.status(500).send(
                  new Response({
                    errors: ["There was a problem"],
                    msg: "There was a problem",
                  })
                )
              );
            });
          break;
        default:
          reject(res.status(404).end());
          break;
      }
    }
  );
}
