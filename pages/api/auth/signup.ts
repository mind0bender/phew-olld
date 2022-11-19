import type { NextApiRequest, NextApiResponse } from "next";
import User, { UserInterface } from "../../../database/models/user";
import Response from "../../../helpers/response";
import dbConnect from "../../../lib/dbconnect";
import validator from "validator";
import { ObjectId } from "mongoose";

const { isEmpty, isEmail } = validator;

type userInfo = {
  username: string;
  password: string;
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return new Promise(
    (resolve: (value: any) => void, reject: (reasons: any) => void) => {
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
                resolve(
                  res.status(422).send(
                    new Response({
                      errors: errs,
                      msg: "Invalid Credentials:",
                    })
                  )
                );
              }

              if (isEmpty(username)) {
                errs.push("`username` is required");
              } else if (isEmail(username)) {
                errs.push("`username` can not be an email");
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
                resolve(
                  res.status(422).send(
                    new Response({
                      errors: errs,
                      msg: "Invalid Credentials:",
                    })
                  )
                );
              }

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
                    resolve(
                      res.status(403).send(
                        new Response({
                          errors: ["`username` or `email` already exists"],
                          msg: "Conflicting Credentials:",
                        })
                      )
                    );
                  } else {
                    const client: UserInterface = new User({
                      username,
                      password,
                      email,
                    });
                    client
                      .save()
                      .then((userDoc: UserInterface): void => {
                        resolve(
                          res.status(201).send(
                            new Response({
                              data: {
                                user: userDoc,
                              },
                              msg: "User Created",
                            })
                          )
                        );
                      })
                      .catch((err: Error): void => {
                        console.error(err);
                        resolve(
                          res.status(500).send(
                            new Response({
                              errors: ["There was some problem"],
                              msg: "There was some problem",
                            })
                          )
                        );
                      });
                  }
                })
                .catch((err: Error): void => {
                  console.error(err);
                  resolve(
                    res.status(500).send(
                      new Response({
                        errors: ["There was some problem"],
                        msg: "There was some problem",
                      })
                    )
                  );
                });
            })
            .catch((err: Error): void => {
              resolve(
                res.status(500).send(
                  new Response({
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
