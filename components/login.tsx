import { ShareableUser } from "../helpers/shareableModel";
import validator from "validator";
import axios, { AxiosError, AxiosResponse } from "axios";
import Response, { ResponseData } from "../helpers/response";
import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { UserContext, UserType } from "../pages";
import WhoAmI from "./whoami";
import { ErrorData } from "./Error";

const { isEmpty } = validator;
export interface LoginData {
  user: string;
  pswd: string;
}

export interface UserAndToken {
  user: ShareableUser;
  token: string;
}

export const onLogin: (loginData: LoginData) => Promise<UserAndToken> = (
  loginData: LoginData
): Promise<UserAndToken> => {
  return new Promise<UserAndToken>(
    (
      resolve: (value: UserAndToken) => void,
      reject: (reason?: ErrorData) => void
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
          }: AxiosResponse<{ data: UserAndToken }, any>): void => {
            const sd: ShareableUser = {
              username: user.username,
              email: user.email,
            };
            resolve({ user: sd, token });
          }
        )
        .catch((resWithErr: AxiosError<ResponseData<undefined>>): void => {
          const dataWithErr: { msg: string; errors: string[] } = {
            msg: resWithErr.response?.data.msg || "",
            errors: resWithErr.response?.data.errors || [],
          };
          reject(dataWithErr);
        });
    }
  );
};

function Login({ user, token }: UserAndToken): JSX.Element {
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
