import type { NextApiRequest, NextApiResponse } from "next";
import User, { UserInterface } from "../../../database/models/user";
import { ResponseObj } from "../../../helpers/response";
import dbConnect from "../../../lib/dbconnect";
import validator from "validator";
import { ObjectId } from "mongoose";
import { shareableUser } from "../../../helpers/shareableModel";
import { sign } from "../../../lib/jwt";
import responseObj from "../../../helpers/response";
import { LoginData } from "../../../controllers/auth/login.controller";
import { NOT_ALLOWED_USERNAMES } from "../../../constants";
const { isEmpty, isEmail } = validator;

type userInfo = {
  username: string;
  password: string;
  email: string;
};

export type SignupData = LoginData;

export type SignupResponse = ResponseObj<SignupData>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
): Promise<any> {
  return new Promise<any>(
    (
      resolve: (value: NextApiResponse | void) => void,
      reject: (reasons: any) => void
    ): void => {
      switch (req.method) {
        case "POST":
          dbConnect()
            .then((): void => {
              let { username, password, email }: userInfo = req.body;

              const errs: string[] = [];

              if (typeof username === "string") username = username.trim();
              else errs.push("Invalid `username`");
              if (typeof password === "string") password = password.trim();
              else errs.push("Invalid `passowrd`");
              if (typeof email === "string") email = email.trim();
              else errs.push("Invalid `email`");

              if (errs.length) {
                return resolve(
                  res.status(422).send(
                    responseObj<SignupData>({
                      errors: errs,
                      msg: "Invalid Credentials:",
                    })
                  )
                );
              } else {
                if (isEmpty(username)) {
                  errs.push("`username` is required");
                } else if (isEmail(username)) {
                  errs.push("`username` can not be an email");
                } else if (NOT_ALLOWED_USERNAMES.includes(username)) {
                  errs.push("`username` not allowed");
                }
                if (isEmpty(password)) {
                  errs.push("`password` is required");
                } else if (
                  !validator.isLength(password, {
                    min: 4,
                    max: 16,
                  })
                ) {
                  errs.push("`password` must be between 4 and 16 characters.");
                }
                if (!isEmail(email)) {
                  errs.push("Invalid `email`");
                }

                if (errs.length) {
                  return resolve(
                    res.status(422).send(
                      responseObj<SignupData>({
                        errors: errs,
                        msg: "Invalid Credentials:",
                      })
                    )
                  );
                } else {
                  User.exists({
                    $or: [
                      {
                        email,
                      },
                      { username },
                    ],
                  })
                    .exec()
                    .then((docExists: { _id: ObjectId } | null): void => {
                      if (docExists) {
                        return resolve(
                          res.status(403).send(
                            responseObj<SignupData>({
                              errors: ["`username` or `email` already exists"],
                              msg: "Conflicting Credentials:",
                            })
                          )
                        );
                      } else {
                        const client: UserInterface = new User({
                          username,
                          password,
                          email: email,
                        });
                        client
                          .save()
                          .then((userDoc: UserInterface): void => {
                            sign(userDoc._id)
                              .then((token: string): void => {
                                return resolve(
                                  res.status(201).send(
                                    responseObj<SignupData>({
                                      data: {
                                        user: shareableUser(userDoc),
                                        token,
                                      },
                                      msg: "User Created",
                                    })
                                  )
                                );
                              })
                              .catch((err: Error): void => {
                                return reject(
                                  res.send(
                                    responseObj<SignupData>({
                                      errors: ["Can not create JWT"],
                                      msg: "There was some problem",
                                    })
                                  )
                                );
                              });
                          })
                          .catch((err: Error): void => {
                            return resolve(
                              res.status(500).send(
                                responseObj<SignupData>({
                                  errors: ["There was some problem"],
                                  msg: "There was some problem",
                                })
                              )
                            );
                          });
                      }
                    })
                    .catch((err: Error): void => {
                      return resolve(
                        res.status(500).send(
                          responseObj<SignupData>({
                            errors: ["There was some problem"],
                            msg: "There was some problem",
                          })
                        )
                      );
                    });
                }
              }
            })
            .catch((err: Error): void => {
              return resolve(
                res.status(500).send(
                  responseObj<SignupData>({
                    errors: ["There was some problem"],
                    msg: "There was some problem",
                  })
                )
              );
            });
          break;
        default:
          resolve(res.status(404).end());
          break;
      }
    }
  );
}
