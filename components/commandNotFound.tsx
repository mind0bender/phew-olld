import React, { FC } from "react";

interface CommandNotFoundData {
  command: string;
}

const CommandNotFound: FC<CommandNotFoundData> = ({
  command,
}: CommandNotFoundData) => {
  return (
    <div>
      <span className="text-red-500">{command.split(" ")[0]}</span>
      <span className="text-red-400">: command not found</span>
      <div>Try &apos;help&apos; to get started</div>
    </div>
  );
};

export default CommandNotFound;
