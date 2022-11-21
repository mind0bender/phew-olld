import { ParsedCommand, parsedForLogin } from "../helpers/commandparser";
import { ShareableUser } from "../helpers/shareableModel";
import validator from "validator";
import axios, { AxiosError, AxiosResponse } from "axios";
import Response from "../helpers/response";
import { ReactNode } from "react";

const { isEmpty } = validator;
export interface LoginData {
  user: string;
  pswd: string;
}

export const onLogin: (
  parsedCommand: ParsedCommand
) => Promise<ShareableUser> = (
  parsedCommand: ParsedCommand
): Promise<ShareableUser> => {
  const loginData: LoginData = parsedForLogin(parsedCommand);
  return new Promise(
    (
      resolve: (value: ShareableUser) => void,
      reject: (reason?: { msg: string; errors: string[] }) => void
    ): void => {
      if (isEmpty(loginData.user) && isEmpty(loginData.pswd)) {
        reject({
          msg: "No arguments passed:",
          errors: [
            `
...args:
    user : \`username\` of the account,
    pswd : \`password\` of the account,
            
usage-
    login /<username>/<password>
    or
    login /?user=<username>&pswd=<password>`,
          ],
        });
      }
      axios
        .post("/api/auth/login", {
          username: loginData.user,
          password: loginData.pswd,
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

function Login({ data }: { data: ShareableUser }) {
  return (
    <div>
      <div>Logged in as:</div>
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

export default Login;
