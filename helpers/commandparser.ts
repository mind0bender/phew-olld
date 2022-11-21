import { LoginData } from "../components/login";
import { SignupData } from "../components/signup";

export interface ParsedCommand {
  command: string;
  params: Map<string, string[]>;
  args: string[];
}

const parseCommand: (commandString: string) => ParsedCommand = (
  commandString: string
): ParsedCommand => {
  const command: string = commandString.split(" ")[0];
  const args: string[] = [];
  const params: Map<string, string[]> = new Map();
  if (commandString.includes(" ")) {
    const argsAndParamsString: string = commandString.substring(
      commandString.indexOf(" ") + 1
    );
    const paramsStart: number =
      argsAndParamsString.indexOf("?") !== -1
        ? argsAndParamsString.indexOf("?")
        : argsAndParamsString.length;
    const argsString: string = argsAndParamsString.substring(0, paramsStart);
    args.push(...argsString.split("/").filter(Boolean));
    const paramsString: string = argsAndParamsString.substring(
      paramsStart,
      argsAndParamsString.length
    );
    const serachParams = new URLSearchParams(paramsString);
    for (const key of serachParams.keys()) {
      const values: string[] = serachParams.getAll(key);
      if (!(key in params)) {
        params.set(key, values);
      }
    }
  }
  return {
    command,
    args,
    params,
  };
};

type FromParsed = Map<number, string>; // { 0 => "user", 1 => "pswd", 2 => "email"}

type Data = Map<string, string>;

const parsedToData: (
  parsedCommand: ParsedCommand,
  fromParsed: FromParsed
) => Data = (parsedCommand: ParsedCommand, fromParsed: FromParsed): Data => {
  const data: Data = new Map();
  Array.from(fromParsed.keys()).forEach((from: number): void => {
    if (fromParsed.get(from)) {
      const key: string = fromParsed.get(from) || "";
      if (parsedCommand.args.length > from) {
        data.set(key, parsedCommand.args[from]);
      } else if (
        parsedCommand.params.get(key) &&
        parsedCommand.params.get(key)?.[0]
      ) {
        const paramVal: string = parsedCommand.params.get(key)?.[0] || "";
        data.set(key, paramVal);
      }
    }
  });
  return data;
};

export const parsedForSignup: (parsedCommand: ParsedCommand) => SignupData = (
  parsedCommand: ParsedCommand
): SignupData => {
  const fromParsed = new Map([
    [0, "user"],
    [1, "pswd"],
    [2, "email"],
  ]);
  const PD: Data = parsedToData(parsedCommand, fromParsed);
  return {
    user: PD.get("user") || "",
    pswd: PD.get("pswd") || "",
    email: PD.get("email") || "",
  };
};

export const parsedForLogin: (parsedCommand: ParsedCommand) => LoginData = (
  parsedCommand: ParsedCommand
): LoginData => {
  const fromParsed = new Map([
    [0, "user"],
    [1, "pswd"],
  ]);
  const PD: Data = parsedToData(parsedCommand, fromParsed);

  return {
    user: PD.get("user") || "",
    pswd: PD.get("pswd") || "",
  };
};

export default parseCommand;
