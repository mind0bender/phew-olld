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
        msg: "Try &apos;help&apos; to get started",
        errors: [`${command.split(" ")[0]}: command not found`],
      }}
    />
  );
};

{
  /* <span className="text-red-500">{command.split(" ")[0]}</span>
<span className="text-red-400">: command not found</span>
<div>Try &apos;help&apos; to get started</div> */
}
export default CommandNotFound;
