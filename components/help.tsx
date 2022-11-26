import React, { ReactNode } from "react";

interface CommandsData {
  [key: string]: {
    desc: string;
    details?: string;
  };
}

const commands: CommandsData = {
  help: {
    desc: `don't know what to do? IDK either [jk, ofc IK]
    try \`help help\` for more info`,
    details: `Know what you want about any command
usage-
    help <command>`,
  },
  whoami: {
    desc: `memory loss? print the username.`,
    details: `    print the username and email of the current user
usage-
    whoami`,
  },
  about: {
    desc: "do you know me? No, you don't",
    details: ``,
  },
  banner: {
    desc: "see a flashy entry",
    details: ``,
  },
  cat: {
    desc: "print the content of a file",
    details: ``,
  },
  getcool: {
    desc: "wanna be like the cool guys?",
    details: ``,
  },
  signup: {
    desc: "create your phew",
    details: `    user : \`username\` of the account,
    pswd : \`password\` of the account,
    email: \`email\` of the account,
            
usage-
    signup /<username>/<password>/<email>
    or
    signup /?user=<username>&pswd=<password>&email=<email></email>`,
  },
  login: {
    desc: "who are you again?",
    details: ``,
  },
  ls: {
    desc: "list all files and directory",
    details: ``,
  },
  clear: {
    desc: "clear the phew",
    details: ``,
  },
};

interface HelpProps {
  helpForCommand?: string;
}

const Help: React.FC<HelpProps> = ({
  helpForCommand = "",
}: HelpProps): JSX.Element => {
  if (helpForCommand) {
    return (
      <HelpCommand
        command={helpForCommand}
        desc={commands[helpForCommand].desc}
        details={commands[helpForCommand].details}
      />
    );
  }
  return (
    <div>
      {Object.keys(commands).map((command: string, idx: number): ReactNode => {
        return (
          <HelpCommand
            key={idx}
            command={command}
            desc={commands[command].desc}
          />
        );
      })}
    </div>
  );
};

export interface CommandData {
  command: string;
  desc: string;
  details?: string;
}

const HelpCommand: React.FC<CommandData> = ({
  command,
  desc,
  details,
}: CommandData): JSX.Element => {
  return (
    <div>
      <div className="text-amber-300">{command}</div>
      <div className="pl-6 text-white">
        <div>- {desc}</div>
        {details && <div>{details}</div>}
      </div>
    </div>
  );
};

export default Help;
