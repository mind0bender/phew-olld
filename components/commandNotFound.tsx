import React, { FC } from "react";
import ErrorComponent from "./Error";

interface CommandNotFoundData {
  command: string;
}

const CommandNotFound: FC<CommandNotFoundData> = ({
  command,
}: CommandNotFoundData): JSX.Element => {
  return (
    <ErrorComponent
      msg={"Try `help` to get started"}
      errors={[`${command.split(" ")[0]}: command not found`]}
    />
  );
};

export default CommandNotFound;
