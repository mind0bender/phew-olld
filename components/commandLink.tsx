import { ReactNode, useContext } from "react";
import { CommandContext } from "../pages";

const CommandLink: ({
  children,
  command,
}: {
  command: string;
  children: ReactNode;
}) => JSX.Element = ({
  children,
  command,
}: {
  children: ReactNode;
  command: string;
}): JSX.Element => {
  const {
    command: [, setCommand],
    caretPosition: [, setCaretPosition],
  } = useContext(CommandContext);
  return (
    <span
      onClick={(): void => {
        if (setCommand && setCaretPosition) {
          setCommand(command);
          setCaretPosition(command.length);
        }
      }}
      className="text-amber-300 underline hover:bg-slate-800 hover:ring ring-slate-800 shadow-sm cursor-pointer rounded-sm px-1 py-0.5 duration-100"
    >
      [{children}]
    </span>
  );
};

export default CommandLink;
