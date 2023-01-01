import React, { ReactNode } from "react";
import Banner from "../components/banner";
import CommandNotFound from "../components/commandNotFound";
import Help from "../components/help";
import Output from "../components/output";
import Signup, { onSignup } from "../components/signup";
import parseCommand, { ParsedCommand, parsedForLogin } from "./commandparser";
import { ShareableUser } from "./shareableModel";
import ErrorComponent, { ErrorData } from "../components/Error";
import Login, { LoginData, onLogin } from "../components/login";
import WhoAmI from "../components/whoami";
import VideoPlayer from "../components/videoPlayer";

const runCommand: (command: string) => Promise<ReactNode> = (
  command: string
): Promise<ReactNode> => {
  const cmd: string = command.trim();
  return new Promise<ReactNode>(
    (
      resolve: (value: ReactNode) => void,
      reject: ({ clear = false, err }: { clear?: boolean; err?: any }) => void
    ): void => {
      const parsedCommand: ParsedCommand = parseCommand(cmd);
      switch (parsedCommand.command) {
        case "":
          resolve(<Output />);
          break;
        case "clear":
          reject({
            clear: true,
          });
          break;
        case "whoami":
          resolve(
            <Output>
              <WhoAmI />
            </Output>
          );
        case "help":
          const helpForCommand: string | undefined = parsedCommand.args[0];
          resolve(
            <Output>
              <Help helpForCommand={helpForCommand} />
            </Output>
          );
          break;
        case "banner":
          resolve(
            <Output>
              <Banner />
            </Output>
          );
          break;
        case "signup":
          onSignup(parsedCommand)
            .then((data: { user: ShareableUser; token: string }) => {
              resolve(
                <Output>
                  <Signup user={data.user} token={data.token} />
                </Output>
              );
            })
            .catch((errorData: ErrorData): void => {
              reject({
                err: (
                  <Output>
                    <ErrorComponent {...errorData} />
                  </Output>
                ),
              });
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
                resolve(
                  <Output>
                    <Login user={user} token={token} />
                  </Output>
                );
              }
            )
            .catch((errorData: ErrorData): void => {
              reject({
                err: (
                  <Output>
                    <ErrorComponent {...errorData} />
                  </Output>
                ),
              });
            });
          break;
        case "getcool":
          resolve(
            <Output>
              <VideoPlayer
                src={"https://shattereddisk.github.io/rickroll/rickroll.mp4"}
                title={"This should be a good lesson"}
                autoPlay
              />
            </Output>
          );
        default:
          resolve(
            <Output>
              <CommandNotFound command={parsedCommand.command} />
            </Output>
          );
          break;
      }
    }
  );
};

export default runCommand;

//github info "https://github-readme-stats.vercel.app/api?username=mind0bender&count_private=true&show_icons=true&hide_border=true&theme=tokyonight"
