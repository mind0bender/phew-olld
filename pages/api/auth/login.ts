import { NextApiRequest, NextApiResponse } from "next";
import login, {
  LoginData,
  LoginResponse,
} from "../../../controllers/auth/login.controller";
import { ResponseData } from "../../../helpers/response";

const loginHandler: (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<LoginData>>
) => Promise<void> = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<LoginData>>
): Promise<void> => {
  return new Promise<void>(
    (resolve: (value?: any) => void, reject: (reason?: any) => void): any => {
      switch (req.method) {
        case "POST":
          const _id: string | undefined = req.cookies._id;
          let { username, password }: { username: string; password: string } =
            req.body;
          login({ _id, username, password }).then(
            ({ data, status }: LoginResponse): void => {
              setTimeout(() => {
                res.status(status).send(data);
              }, 3000);
            }
          );
          break;
        default:
          resolve(res.status(404).end());
          break;
      }
    }
  );
};

export default loginHandler;
