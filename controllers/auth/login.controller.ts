import { isObjectIdOrHexString, ObjectId } from "mongoose";
import user, { UserInterface } from "../../database/models/user";
import Response from "../../helpers/response";
import { shareableUser } from "../../helpers/shareableModel";
import dbConnect from "../../lib/dbconnect";
import validator from "validator";
import { sign } from "../../lib/jwt";
const { isEmpty } = validator;

export interface loginControllerData {
  _id?: string;
  username?: string;
  password?: string;
}

const login: ({ _id, username, password }: loginControllerData) => Promise<{
  data: Response;
  status: number;
}> = ({
  _id,
  username,
  password,
}: loginControllerData): Promise<{
  data: Response;
  status: number;
}> => {
  return new Promise(
    (resolve: (value: { data: Response; status: number }) => void): void => {
      dbConnect()
        .then((): void => {
          if (isObjectIdOrHexString(_id)) {
            user
              .findById(_id)
              .then((userDoc: UserInterface): void => {
                if (userDoc) {
                  sign(userDoc._id)
                    .then((token: string): void => {
                      return resolve({
                        data: new Response({
                          data: {
                            user: shareableUser(userDoc),
                            token,
                          },
                          msg: "Login successfull",
                        }),
                        status: 200,
                      });
                    })
                    .catch((): void => {
                      return resolve({
                        data: new Response({
                          errors: ["There was a problem"],
                          msg: "There was a problem",
                        }),
                        status: 500,
                      });
                    });
                } else {
                  return resolve({
                    data: new Response({
                      errors: ["User not found"],
                      msg: "There was a problem",
                    }),
                    status: 200,
                  });
                }
              })
              .catch((): void => {
                return resolve({
                  data: new Response({
                    errors: ["Problem finding user"],
                    msg: "There was a problem",
                  }),
                  status: 200,
                });
              });
          } else {
            const errs: string[] = [];

            if (typeof username === "string") username = username.trim();
            else errs.push("Invalid `username`");
            if (typeof password === "string") password = password.trim();
            else errs.push("Invalid `passowrd`");

            if (errs.length) {
              return resolve({
                data: new Response({
                  errors: errs,
                  msg: "Invalid Credentials:",
                }),
                status: 422,
              });
            } else {
              if (!username || isEmpty(username)) {
                errs.push("`username` is required");
              }
              if (!password || isEmpty(password)) {
                errs.push("`password` is required");
              } else if (
                typeof password === "string" &&
                !validator.isLength(password, {
                  min: 4,
                  max: 16,
                })
              ) {
                errs.push("`password` must be between 4 and 16 characters.");
              }

              if (errs.length) {
                return resolve({
                  data: new Response({
                    msg: "Invalid Credentials:",
                    errors: errs,
                  }),
                  status: 422,
                });
              } else {
                user
                  .exists({ username })
                  .then((doc: { _id: ObjectId } | null): void => {
                    if (!doc) {
                      return resolve({
                        data: new Response({
                          msg: "User not found",
                          errors: ["User not found"],
                        }),
                        status: 402,
                      });
                    } else {
                      user
                        .findById(doc._id)
                        .then((userDoc: UserInterface): void => {
                          userDoc
                            .validatePassword(password!)
                            .then((isMatched: boolean): void => {
                              if (!isMatched) {
                                return resolve({
                                  data: new Response({
                                    errors: ["Incorrect password"],
                                    msg: "Incorrect password",
                                  }),
                                  status: 402,
                                });
                              } else {
                                sign(userDoc._id)
                                  .then((token: string): void => {
                                    return resolve({
                                      data: new Response({
                                        data: {
                                          user: shareableUser(userDoc),
                                          token,
                                        },
                                        msg: "Login successfull",
                                      }),
                                      status: 200,
                                    });
                                  })
                                  .catch((): void => {
                                    return resolve({
                                      data: new Response({
                                        errors: ["There was a problem"],
                                        msg: "There was a problem",
                                      }),
                                      status: 500,
                                    });
                                  });
                              }
                            })
                            .catch((err: Error): void => {
                              return resolve({
                                data: new Response({
                                  errors: ["There was a problem"],
                                  msg: "There was a problem",
                                }),
                                status: 500,
                              });
                            });
                        })
                        .catch((err: Error): void => {
                          return resolve({
                            data: new Response({
                              errors: ["There was a problem"],
                              msg: "There was a problem",
                            }),
                            status: 500,
                          });
                        });
                    }
                  })
                  .catch((err: Error): void => {
                    return resolve({
                      data: new Response({
                        errors: ["There was a problem"],
                        msg: "There was a problem",
                      }),
                      status: 500,
                    });
                  });
              }
            }
          }
        })
        .catch((err: Error): void => {
          return resolve({
            data: new Response({
              errors: ["There was a problem"],
              msg: "There was a problem",
            }),
            status: 500,
          });
        });
    }
  );
};
export default login;
