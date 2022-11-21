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
    (resolve: (value?: any) => void, reject: (reason?: any) => void): any => {
      switch (req.method) {
        case "POST":
          dbConnect()
            .then((): void => {
              const _id: string | undefined = req.cookies._id;

              if (isObjectIdOrHexString(_id)) {
                user
                  .findById(_id)
                  .then((userDoc: UserInterface): void => {
                    if (userDoc) {
                      return resolve(
                        res.send(
                          new Response({
                            data: { user: shareableUser(userDoc) },
                            msg: "Login successfull",
                          })
                        )
                      );
                    } else {
                      return resolve(
                        res.send(
                          new Response({
                            errors: ["User not found"],
                            msg: "There was a problem",
                          })
                        )
                      );
                    }
                  })
                  .catch((): void => {
                    return resolve(
                      res.send(
                        new Response({
                          errors: ["Problem finding user"],
                          msg: "There was a problem",
                        })
                      )
                    );
                  });
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
                  return resolve(
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
                    return resolve(
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
                          return resolve(
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
                                    return resolve(
                                      res.status(401).send(
                                        new Response({
                                          errors: ["Incorrect password"],
                                          msg: "Incorrect password",
                                        })
                                      )
                                    );
                                  } else {
                                    return resolve(
                                      res.send(
                                        new Response({
                                          data: {
                                            user: shareableUser(userDoc),
                                          },
                                          msg: "Login successfull",
                                        })
                                      )
                                    );
                                  }
                                })
                                .catch((err: Error): void => {
                                  return resolve(
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
                              return resolve(
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
                        return resolve(
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
              return resolve(
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
          return resolve(res.status(404).end());
          break;
      }
    }
  );
}
