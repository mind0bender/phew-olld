import React, { ReactNode } from "react";
import Banner from "../components/banner";
import CommandNotFound from "../components/commandNotFound";
import Help from "../components/help";
import Output from "../components/output";

const runCommand: (prompt: string, command: string) => ReactNode = (
  prompt: string,
  command: string
): ReactNode => {
  const cmd: string = command.trim();
  if (!cmd.length) {
    return <Output prompt={prompt} command={command} output={[]} />;
  }
  if (cmd.startsWith("help")) {
    return <Output prompt={prompt} command={command} output={<Help />} />;
  }
  if (cmd.startsWith("banner")) {
    return <Output prompt={prompt} command={command} output={<Banner />} />;
  }
  if (cmd.startsWith("clear")) {
    return clear();
  }

  return (
    <Output
      prompt={prompt}
      command={command}
      output={<CommandNotFound command={command} />}
    />
  );
};

const about: () => ReactNode = (): ReactNode => {
  return <div></div>;
};

const clear = () => {
  return false;
};

export default runCommand;

//github info "https://github-readme-stats.vercel.app/api?username=mind0bender&count_private=true&show_icons=true&hide_border=true&theme=tokyonight"
