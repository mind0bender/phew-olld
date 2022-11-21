import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useContext, useEffect } from "react";
import { ParsedCommand, parsedForSignup } from "../helpers/commandparser";
import Response from "../helpers/response";
import { ShareableUser } from "../helpers/shareableModel";
import validator from "validator";
import { useCookies } from "react-cookie";
import { UserContext, UserType } from "../pages";

const { isEmpty } = validator;

export interface SignupData {
  user: string;
  pswd: string;
  email: string;
}

export const onSignup: (
  parsedCommand: ParsedCommand
) => Promise<{ user: ShareableUser; token: string }> = (
  parsedCommand: ParsedCommand
): Promise<{ user: ShareableUser; token: string }> => {
  const signupData: SignupData = parsedForSignup(parsedCommand);
  return new Promise(
    (
      resolve: (value: { user: ShareableUser; token: string }) => void,
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
    signup /?user=<username>&pswd=<password>&email=<email>`,
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
              data: { user, token },
            },
          }: AxiosResponse<
            { data: { user: ShareableUser; token: string } },
            any
          >): void => {
            const sd: { user: ShareableUser; token: string } = {
              user: {
                username: user.username,
                email: user.email,
              },
              token,
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

function SignUp({ user, token }: { user: ShareableUser; token: string }) {
  const [, setCookie] = useCookies<"jwt", { jwt: string }>(["jwt"]);
  const [, setUser] = useContext<UserType>(UserContext);
  useEffect((): (() => void) => {
    setCookie("jwt", token);
    setUser && setUser(user);
    return (): void => {};
  }, [token, setCookie, user, setUser]);

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
              <div>{user.username}</div>
            </div>
            <div className="flex gap-2">
              <div>email{"   :"}</div>
              <a
                className="underline decoration-solid hover:decoration-2 decoration-slate-600"
                target="_blank"
                rel="noreferrer"
                href={`mailto:${user.email}`}
              >
                {user.email}
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

export default SignUp;
