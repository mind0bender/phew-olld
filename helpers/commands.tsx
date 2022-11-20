import React, { ReactNode } from "react";
import Banner from "../components/banner";
import CommandNotFound from "../components/commandNotFound";
import Help from "../components/help";
import Output from "../components/output";
import Signup, { onSignup } from "../components/signup";
import parseCommand, { ParsedCommand } from "./commandparser";
import { ShareableUser } from "./shareableModel";
import ErrorComponent from "../components/Error";

const runCommand: (command: string) => Promise<ReactNode> = (
  command: string
): Promise<ReactNode> => {
  const cmd: string = command.trim();
  return new Promise(
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
            .then((sd: ShareableUser) => {
              resolve(
                <Output>
                  <Signup data={sd} />
                </Output>
              );
            })
            .catch((dataWithErr: { msg: string; errors: string[] }) => {
              reject({
                err: (
                  <Output>
                    <ErrorComponent data={dataWithErr} />
                  </Output>
                ),
              });
            });
          break;
        default:
          resolve(
            <Output>
              <CommandNotFound command={command} />
            </Output>
          );
          break;
      }
    }
  );
};

export default runCommand;

//github info "https://github-readme-stats.vercel.app/api?username=mind0bender&count_private=true&show_icons=true&hide_border=true&theme=tokyonight"
