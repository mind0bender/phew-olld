import { CloseSharp } from "@mui/icons-material";
import type { NextPage } from "next";
import Head from "next/head";
import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEvent,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import runCommand from "../helpers/commands";

const Home: NextPage = () => {
  const [command, setCommand] = useState<string>("help"); //pink
  const cmdInp: MutableRefObject<null | HTMLInputElement> =
    useRef<null | HTMLInputElement>(null);
  const caret: MutableRefObject<null | HTMLSpanElement> =
    useRef<null | HTMLSpanElement>(null);
  const [user, setUser] = useState({
    name: "mind0bender",
  });
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [caretPosition, setCaretPosition] = useState<number>(0);
  const [path, setPath] = useState("~");
  const [prevCommands, setPrevCommands] = useState<string[]>([]);
  const [prevCommandsIdx, setPrevCommandsIdx] = useState<number>(-1);

  const [output, setOutput] = useState<ReactNode[]>([
    <div key={-1}>
      <div>
        Welcome to <span className="text-emerald-300">PHEW</span>
      </div>
      <div>
        Type{" "}
        <span
          onClick={() => {
            setCommand("help");
            setCaretPosition(4);
          }}
          className="text-amber-300 underline hover:bg-slate-800 hover:ring ring-slate-800 shadow-sm cursor-pointer rounded-sm px-1 py-0.5 duration-100"
        >
          help
        </span>{" "}
        for more info
      </div>
    </div>,
  ]);

  useEffect((): (() => void) => {
    setIsFocused(document.hasFocus());
    cmdInp.current?.focus();
    setIsFocused(document.hasFocus());
    const onblur: () => void = (): void => {
      setIsFocused(document.hasFocus());
    };
    window.addEventListener("blur", onblur);
    return (): void => {
      window.removeEventListener("blur", onblur);
    };
  }, []);

  useEffect((): (() => void) => {
    caret.current?.scrollIntoView({
      behavior: "auto",
    });
    return (): void => {};
  }, [output]);

  useEffect(() => {
    if (prevCommandsIdx == -1) {
      setCommand("");
    } else if (prevCommands[prevCommandsIdx]) {
      setCommand(prevCommands[prevCommandsIdx]);
    }
    return () => {};
  }, [prevCommandsIdx, prevCommands]);

  const keyUpCaptureHandler: KeyboardEventHandler<HTMLInputElement> = (
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    setCaretPosition(cmdInp.current?.selectionEnd || 0);
  };

  const keyDownHandler: KeyboardEventHandler<HTMLInputElement> = (
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") {
      const out: ReactNode = runCommand(`phew@${user.name}:${path}$`, command);
      if (out) {
        setOutput((po: ReactNode[]): ReactNode[] => [...po, out]);
      } else {
        setOutput([]);
      }
      setPrevCommands((ppcs: string[]): string[] => [...ppcs, command]);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (prevCommandsIdx !== 0) {
        setPrevCommandsIdx((pci: number): number => {
          if (pci == -1) {
            return prevCommands.length - 1;
          }
          return pci - 1;
        });
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (prevCommandsIdx !== -1 && prevCommandsIdx < prevCommands.length - 1) {
        setPrevCommandsIdx((pci: number): number => {
          return pci + 1;
        });
      }
      if (prevCommandsIdx == prevCommands.length - 1) {
        setPrevCommandsIdx(-1);
      }
    } else {
      setPrevCommandsIdx(-1);
    }
  };

  const focusChangeHandler: FocusEventHandler<HTMLInputElement> = (
    e: FocusEvent<HTMLInputElement>
  ) => {
    const selectedText: string | undefined = window.getSelection()?.toString();
    if (!selectedText) {
      setIsFocused(document.activeElement == cmdInp.current);
    }
  };

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setCommand(e.target.value);
  };

  return (
    <>
      <Head>
        <title>
          {user.name}:{path}
        </title>
      </Head>
      <div className="flex flex-col w-full h-screen p-2 bg-slate-900 font-extralight font-mono">
        <div className="flex justify-between rounded-t-md">
          <div className="bg-slate-800 text-white px-10 py-1 shadow-inner shadow-slate-700 border-t-2 border-x-2 rounded-t-md border-slate-700">
            some-random-process
          </div>
          <div className="grow border-slate-700 border-b-2" />
          <div className="border-b-2 hover:bg-red-600 rounded-tr-md border-slate-700">
            <button
              title="not yet; pink"
              className="text-white p-1 rounded-tr-md duration-150"
            >
              <CloseSharp />
            </button>
          </div>
        </div>
        <label htmlFor="cmdinp" className="flex grow">
          <div className="grow cursor-text h-[calc(100vh-3.5rem)] overflow-y-scroll scrollbar rounded-b-md p-2 border-x-2 border-b-2 border-slate-700">
            <input
              id="cmdinp"
              ref={cmdInp}
              onKeyUpCapture={keyUpCaptureHandler}
              onKeyDown={keyDownHandler}
              onFocus={focusChangeHandler}
              onBlur={focusChangeHandler}
              className="bg-transparent opacity-0 full -translate-x-[99999rem] -z-10 absolute outline-none border-none"
              type="text"
              value={command}
              onChange={onChangeHandler}
            />
            <div className="flex flex-col gap-1">
              {output.map((line: ReactNode, idx) => {
                return (
                  <div
                    className="text-gray-200 whitespace-pre-wrap break-all selection:bg-emerald-500 selection:text-slate-900"
                    key={idx}
                  >
                    {line}
                    <br />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 max-h-fit items-baseline">
              <div className="text-emerald-300 max-h-fit">
                phew@{user.name}:{path}$
              </div>
              <div className="text-gray-200 whitespace-pre-wrap break-all selection:bg-emerald-500 selection:text-slate-900">
                {Array.from(command.slice(0, caretPosition)).map(
                  (char: string, idx: number) => (
                    <span key={idx}>{char}</span>
                  )
                )}
                <span
                  ref={caret}
                  className={`h-5 text-gray-200 selection:border-0 border-white border ${
                    isFocused && "animate-blink"
                  }`}
                >
                  {command[caretPosition] || " "}
                </span>
                {Array.from(command.slice(caretPosition + 1)).map(
                  (char: string, idx: number) => (
                    <span key={idx}>{char}</span>
                  )
                )}
              </div>
            </div>
          </div>
        </label>
      </div>
    </>
  );
};

export default Home;

/**
 * Known Bugs!
 * caret stays on first line even when command is multiline.
 */
