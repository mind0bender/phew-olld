import { ShareableUser } from "../helpers/shareableModel";
import validator from "validator";
import { verify } from "./jwt";
import { ObjectId } from "mongoose";
import login from "../controllers/auth/login.controller";
import { NextApiRequest } from "next";
import { defaultUser } from "../components/contextProvider";

const { isEmpty } = validator;

export interface LoginSSInterface {
  initUser: ShareableUser;
  token: string;
}

export const defaultLoginData: LoginSSInterface = {
  initUser: defaultUser,
  token: "",
};

const loginServerSide: (req: NextApiRequest) => Promise<LoginSSInterface> = (
  req: NextApiRequest
) => {
  return new Promise<LoginSSInterface>(
    (resolve: (value: LoginSSInterface) => void, reject: () => void): void => {
      const token: string | undefined = req.cookies.jwt;
      if (token && !isEmpty(token)) {
        verify(token)
          .then(({ _id }: { _id: ObjectId | null }): void => {
            if (_id) {
              login({ _id: String(_id) })
                .then(({ data }: { data: any }): void => {
                  resolve({
                    initUser: data.data.user,
                    token: data.data.token,
                  });
                })
                .catch((err: any): void => {
                  reject();
                });
            } else {
              reject();
            }
          })
          .catch((): void => {
            reject();
          });
      } else {
        reject();
      }
    }
  );
};

export default loginServerSide;
