import React, { ReactNode } from "react";

const commands: CommandData[] = [
  {
    command: "help",
    desc: "don't know what to do? IDK either [jk, ofc IK]",
  },
  {
    command: "about",
    desc: "do you know me? No, you don't",
  },
  {
    command: "banner",
    desc: "see a flashy entry",
  },
  {
    command: "cat",
    desc: "print the content of a file",
  },
  {
    command: "getcool",
    desc: "wanna be like the cool guy?",
  },
  {
    command: "signup",
    desc: "create your phew",
  },
  {
    command: "login",
    desc: "who are you again?",
  },
  {
    command: "ls",
    desc: "list all files and directory",
  },
  {
    command: "clear",
    desc: "clear the phew",
  },
];

const Help: React.FC = () => {
  return (
    <div>
      {commands.map((command: CommandData, idx: number) => {
        return (
          <HelpCommand
            key={idx}
            command={command.command}
            desc={command.desc}
          />
        );
      })}
    </div>
  );
};

interface CommandData {
  command: string;
  desc: string;
}

const HelpCommand: React.FC<CommandData> = ({ command, desc }: CommandData) => {
  return (
    <div>
      <div className="text-amber-300">{command}</div>
      <div className="pl-6 text-white">- {desc}</div>
    </div>
  );
};

export default Help;
