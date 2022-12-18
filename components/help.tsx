import React, { ReactNode } from "react";
import CommandLink from "./commandLink";

export interface CommandsData {
  [key: string]: {
    desc: string;
    details?: string;
  };
}

const commands: CommandsData = {
  help: {
    desc: `don't know what to do? IDK either [jk, ofc IK]`,
    details: `get to know about any command
usage-
    help <command>`,
  },
  whoami: {
    desc: `print the user's info in case of memory loss.`,
    details: `    print the username and email of the current user
usage-
    whoami`,
  },
  about: {
    desc: "what is a phew?",
    details: `understand what a \`phew\` is and how you can use it to your advantage in daily life`,
  },
  banner: {
    desc: "see a flashy banner",
    details: `see PHEW header`,
  },
  cat: {
    desc: "print the content of a phew",
    details: ``,
  },
  getcool: {
    desc: "wanna be like the cool guys?",
    details: ``,
  },
  signup: {
    desc: "create an account",
    details: `    create a new Phew account

    user : \`username\` of the account,
    pswd : \`password\` of the account,
    email: \`email\` of the account,
            
usage-
    signup /<username>/<password>/<email>
    or
    signup /?user=<username>&pswd=<password>&email=<email>`,
  },
  login: {
    desc: "login to a preexisting account",
    details: `    create a new Phew account

    user : \`username\` of the account,
    pswd : \`password\` of the account,
            
usage-
    login /<username>/<password>
    or
    login /?user=<username>&pswd=<password>`,
  },
  ls: {
    desc: "list all collections and phews",
    details: ``,
  },
  clear: {
    desc: "clear the phew",
    details: ``,
  },
};

//  pink; pwd

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
      <div className="pb-2">try `help &lt;command&gt;` for more info</div>
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
      <CommandLink className="cursor-help" command={command}>
        {command}
      </CommandLink>
      <div className="pl-6 text-white">
        <div>- {desc}</div>
        {details && <div>{details}</div>}
      </div>
    </div>
  );
};

export default Help;
