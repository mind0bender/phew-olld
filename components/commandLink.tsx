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
    <span className="hover:bg-slate-800 hover:ring ring-slate-800 cursor-pointer rounded-sm px-0.5 py-0.5 duration-100">
      [
      <span
        onClick={(): void => {
          if (setCommand && setCaretPosition) {
            setCommand(command);
            setCaretPosition(command.length);
          }
        }}
        className="text-amber-300 underline "
      >
        {children}
      </span>
      ]
    </span>
  );
};

export default CommandLink;
