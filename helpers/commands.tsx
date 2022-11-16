import React, { ReactNode } from "react";
import Banner from "../components/banner";
import CommandNotFound from "../components/commandNotFound";
import Help from "../components/help";
import Output from "../components/output";
import Signup, { SignupData } from "../components/signup";
import parseCommand, { ParsedCommand, parsedForSignup } from "./commandparser";
import axios, { AxiosError } from "axios";
import { ShareableUser } from "./shareableModel";
import Response from "./response";
import Error from "../components/Error";

const runCommand: (prompt: string, command: string) => Promise<ReactNode> = (
  prompt: string,
  command: string
): Promise<ReactNode> => {
  const cmd: string = command.trim();
  return new Promise(
    (
      resolve: (value: ReactNode) => void,
      reject: ({ clear = false, err }: { clear?: boolean; err?: any }) => void
    ): void => {
      const parsedCommand: ParsedCommand = parseCommand(command);
      if (parsedCommand.command === "clear") {
        reject({
          clear: true,
        });
      }
      if (!cmd.length) {
        resolve(<Output prompt={prompt} command={command} output={[]} />);
      }
      if (parsedCommand.command === "help") {
        resolve(<Output prompt={prompt} command={command} output={<Help />} />);
      }
      if (parsedCommand.command === "banner") {
        resolve(
          <Output prompt={prompt} command={command} output={<Banner />} />
        );
      }
      if (parsedCommand.command === "signup") {
        const signupData: SignupData = parsedForSignup(parsedCommand);
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
            }) => {
              const sd: ShareableUser = {
                username: user.username,
                email: user.email,
              };
              resolve(
                <Output
                  prompt={prompt}
                  command={command}
                  output={<Signup data={sd} />}
                />
              );
            }
          )
          .catch((resWithErr: AxiosError<Response>) => {
            const dataWithErr: { msg: string; errors: string[] } = {
              msg: resWithErr.response?.data.msg || "",
              errors: resWithErr.response?.data.errors || [],
            };
            reject({
              err: (
                <Output
                  prompt={prompt}
                  command={command}
                  output={<Error data={dataWithErr} />}
                />
              ),
            });
          });
      } else {
        resolve(
          <Output
            prompt={prompt}
            command={command}
            output={<CommandNotFound command={command} />}
          />
        );
      }
    }
  );
};

export default runCommand;

//github info "https://github-readme-stats.vercel.app/api?username=mind0bender&count_private=true&show_icons=true&hide_border=true&theme=tokyonight"
