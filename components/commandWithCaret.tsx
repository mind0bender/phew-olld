import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  useContext,
} from "react";
import { CommandContext } from "./contextProvider";

interface CommandWithCaretProps extends React.ComponentPropsWithRef<"span"> {
  isFocused: boolean;
}

const CommandWithCaret: ForwardRefExoticComponent<CommandWithCaretProps> =
  forwardRef<HTMLSpanElement, CommandWithCaretProps>(
    (
      props: CommandWithCaretProps,
      caret: ForwardedRef<HTMLSpanElement>
    ): JSX.Element => {
      const {
        command: [command],
        caretPosition: [caretPosition],
      } = useContext(CommandContext);
      return (
        <div className="text-gray-200 whitespace-pre-wrap break-all themed-selection">
          {Array.from(command.slice(0, caretPosition)).map(
            (char: string, idx: number): JSX.Element => (
              <span key={idx}>{char}</span>
            )
          )}
          <span
            ref={caret}
            className={`h-5 text-gray-200 selection:ring-0 ring-white ring-1 ${
              props.isFocused && "animate-blink"
            }`}
          >
            {command[caretPosition] || " "}
          </span>
          {Array.from(command.slice(caretPosition + 1)).map(
            (char: string, idx: number): JSX.Element => (
              <span key={idx}>{char}</span>
            )
          )}
        </div>
      );
    }
  );
CommandWithCaret.displayName = "CommandWithCaret";

export default CommandWithCaret;
