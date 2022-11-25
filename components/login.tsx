import { ParsedCommand, parsedForLogin } from "../helpers/commandparser";
import { shareableUser, ShareableUser } from "../helpers/shareableModel";
import validator from "validator";
import axios, { AxiosError, AxiosResponse } from "axios";
import Response from "../helpers/response";
import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { UserContext, UserType } from "../pages";
import WhoAmI from "./whoami";

const { isEmpty } = validator;
export interface LoginData {
  user: string;
  pswd: string;
}

export const onLogin: (
  loginData: LoginData
) => Promise<{ user: ShareableUser; token: string }> = (
  loginData: LoginData
): Promise<{ user: ShareableUser; token: string }> => {
  return new Promise<{ user: ShareableUser; token: string }>(
    (
      resolve: (value: { user: ShareableUser; token: string }) => void,
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
              data: { user, token },
            },
          }: AxiosResponse<
            { data: { user: ShareableUser; token: string } },
            any
          >): void => {
            const sd: ShareableUser = {
              username: user.username,
              email: user.email,
            };
            resolve({ user: sd, token });
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

function Login({ user, token }: { user: ShareableUser; token: string }) {
  const [, setCookie] = useCookies<"jwt", { jwt: string }>(["jwt"]);
  const [, setUser] = useContext<UserType>(UserContext);
  useEffect((): (() => void) => {
    setCookie("jwt", token);
    setUser && setUser(user);
    return (): void => {};
  }, [token, setCookie, user, setUser]);
  return (
    <div>
      <div>Logged in as:</div>
      <WhoAmI userData={user} />
    </div>
  );
}

export default Login;
