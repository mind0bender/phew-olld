import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { ParsedCommand, parsedForSignup } from "../helpers/commandparser";
import Response from "../helpers/response";
import { ShareableUser } from "../helpers/shareableModel";
import validator from "validator";
const { isEmpty } = validator;

export interface SignupData {
  user: string;
  pswd: string;
  email: string;
}

export const onSignup: (
  parsedCommand: ParsedCommand
) => Promise<ShareableUser> = (
  parsedCommand: ParsedCommand
): Promise<ShareableUser> => {
  const signupData: SignupData = parsedForSignup(parsedCommand);
  return new Promise(
    (
      resolve: (value: ShareableUser) => void,
      reject: (reason?: { msg: string; errors: string[] }) => void
    ): void => {
      if (
        isEmpty(signupData.user) &&
        isEmpty(signupData.pswd) &&
        isEmpty(signupData.email)
      ) {
        reject({
          msg: "No arguments passed:",
          errors: [
            `
...args:
    user : \`username\` of the account,
    pswd : \`password\` of the account,
    email: \`email\` of the account,
            
usage-
    signup /<username>/<password>/<email>
    or
    signup /?user=<username>&pswd=<password>&email=<email></email>`,
          ],
        });
      }
      axios
        .post("/api/auth/signup", {
          username: signupData.user,
          password: signupData.pswd,
          email: signupData.email,
        })
        .then(
          ({
            data: {
              data: { user },
            },
          }: AxiosResponse<any, any>): void => {
            const sd: ShareableUser = {
              username: user.username,
              email: user.email,
            };
            console.log("sd", sd);
            resolve(sd);
          }
        )
        .catch((resWithErr: AxiosError<Response>): void => {
          const dataWithErr: { msg: string; errors: string[] } = {
            msg: resWithErr.response?.data.msg || "",
            errors: resWithErr.response?.data.errors || [],
          };
          reject(dataWithErr);
        });
    }
  );
};

function Signup({ data }: { data: ShareableUser }) {
  return (
    <div>
      <div>User created with following information:</div>
      <div className="pl-6 pt-2 max-w-fit">
        <div>+----</div>
        <div className="flex">
          <span>|&nbsp;</span>
          <span>
            <div className="flex gap-2">
              <div>username:</div>
              <div>{data.username}</div>
            </div>
            <div className="flex gap-2">
              <div>email{"   :"}</div>
              <a
                className="underline decoration-solid hover:decoration-2 decoration-slate-600"
                target="_blank"
                rel="noreferrer"
                href={`mailto:${data.email}`}
              >
                {data.email}
              </a>
            </div>
          </span>
          <span className="grow flex flex-col-reverse">&nbsp;|</span>
        </div>
        <div className="flex flex-row-reverse">----+</div>
      </div>
    </div>
  );
}

export default Signup;
