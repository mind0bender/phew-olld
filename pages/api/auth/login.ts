import { ObjectId } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import user, { UserInterface } from "../../../database/models/user";
import Response from "../../../helpers/response";
import { shareableUser } from "../../../helpers/shareableModel";
import dbConnect from "../../../lib/dbconnect";

type userInfo = {
  username: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
): Promise<void> {
  switch (req.method) {
    case "POST":
      dbConnect()
        .then((): void => {
          const { username, password }: userInfo = req.body;
          user
            .exists({ username })
            .then((doc: { _id: ObjectId } | null): void => {
              if (!doc) {
                res.status(401).send(
                  new Response({
                    errors: ["User not found"],
                    msg: "User not found",
                  })
                );
              } else {
                user
                  .findById(doc._id)
                  .then((userDoc: UserInterface): void => {
                    userDoc
                      .validatePassword(password)
                      .then((isMatched: boolean): void => {
                        if (!isMatched) {
                          res.status(401).send({
                            errors: ["Incorrect password"],
                            msg: "Incorrect password",
                          });
                        } else {
                          res.send(shareableUser(userDoc));
                        }
                      })
                      .catch((err: Error): void => {
                        console.log(err);
                        res.status(500).send(
                          new Response({
                            errors: ["There was a problem"],
                            msg: "There was a problem",
                          })
                        );
                      });
                  })
                  .catch((err: Error): void => {
                    console.log(err);
                    res.status(500).send(
                      new Response({
                        errors: ["There was a problem"],
                        msg: "There was a problem",
                      })
                    );
                  });
              }
            })
            .catch((err: Error): void => {
              console.log(err);
              res.status(500).send(
                new Response({
                  errors: ["There was a problem"],
                  msg: "There was a problem",
                })
              );
            });
        })
        .catch((err: Error): void => {
          console.log(err);
          res.status(500).send(
            new Response({
              errors: ["There was a problem"],
              msg: "There was a problem",
            })
          );
        });
      break;
    default:
      res.status(404).end();
      break;
  }
}
