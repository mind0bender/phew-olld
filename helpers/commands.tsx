import React, { ReactNode, MutableRefObject } from "react";
import Banner from "../components/banner";
import CommandNotFound from "../components/commandNotFound";
import Help from "../components/help";
import Signup, { onSignup } from "../components/signup";
import parseCommand, { ParsedCommand, parsedForLogin } from "./commandparser";
import { ShareableUser } from "./shareableModel";
import { ErrorData } from "../components/Error";
import Login, { LoginData, onLogin } from "../components/login";
import WhoAmI from "../components/whoami";
import VideoPlayer from "../components/videoPlayer";
import Logout from "../components/logout";
export interface RunCommandResolved {
  component?: ReactNode;
  clear?: boolean;
  canceled?: boolean;
  editorWindowOpen?: boolean;
}

const runCommand: (
  command: string,
  editorWindowOpen: boolean,
  cancel: MutableRefObject<() => void>
) => Promise<RunCommandResolved> = (
  command: string,
  currentEditorWindowOpen: boolean,
  cancel: MutableRefObject<() => void>
): Promise<RunCommandResolved> => {
  const cmd: string = command.trim();
  return new Promise<RunCommandResolved>(
    (
      resolve: ({
        component,
        clear = false,
        canceled = false,
        editorWindowOpen = currentEditorWindowOpen,
      }: RunCommandResolved) => void,
      reject: (err?: ErrorData) => void
    ): void => {
      cancel.current = (): void => {
        reject({
          msg: "AbortError",
          errors: ["The operation was canceled by the user"],
        });
      };
      const parsedCommand: ParsedCommand = parseCommand(cmd);
      switch (parsedCommand.command) {
        case "":
          resolve({});
          break;
        case "clear":
          resolve({
            clear: true,
          });
          break;
        case "editor":
          resolve({
            editorWindowOpen: true,
          });
          break;
        case "whoami":
          resolve({
            component: <WhoAmI />,
          });
        case "help":
          const helpForCommand: string | undefined = parsedCommand.args[0];
          resolve({
            component: <Help helpForCommand={helpForCommand} />,
          });
          break;
        case "banner":
          resolve({
            component: <Banner />,
          });
          break;
        case "signup":
          onSignup(parsedCommand)
            .then((data: { user: ShareableUser; token: string }) => {
              resolve({
                component: <Signup user={data.user} token={data.token} />,
              });
            })
            .catch((errorData: ErrorData): void => {
              reject(errorData);
            });
          break;
        case "login":
          const loginData: LoginData = parsedForLogin(parsedCommand);
          onLogin(loginData)
            .then(
              ({
                user,
                token,
              }: {
                user: ShareableUser;
                token: string;
              }): void => {
                resolve({
                  component: <Login user={user} token={token} />,
                });
              }
            )
            .catch((errorData: ErrorData): void => {
              console.error(errorData);
              reject(errorData);
            });
          break;
        case "logout":
          resolve({ component: <Logout /> });
        case "getcool":
          resolve({
            component: (
              <VideoPlayer
                src={"https://shattereddisk.github.io/rickroll/rickroll.mp4"}
                title={"This should be a good lesson"}
                autoPlay
              />
            ),
          });
        default:
          resolve({
            component: <CommandNotFound command={parsedCommand.command} />,
          });
          break;
      }
    }
  );
};

export default runCommand;

//github info "https://github-readme-stats.vercel.app/api?username=mind0bender&count_private=true&show_icons=true&hide_border=true&theme=tokyonight"
