import React, { FC } from "react";
import ErrorComponent from "./Error";

interface CommandNotFoundData {
  command: string;
}

const CommandNotFound: FC<CommandNotFoundData> = ({
  command,
}: CommandNotFoundData) => {
  return (
    <ErrorComponent
      data={{
        msg: "Try `help` to get started",
        errors: [`${command.split(" ")[0]}: command not found`],
      }}
    />
  );
};

export default CommandNotFound;
