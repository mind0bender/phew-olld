import { ObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse, NextPage } from "next";
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
  useContext,
} from "react";
import { useCookies } from "react-cookie";
import Greeting from "../components/greeting";
import Processing from "../components/processing";
import { Prompt } from "../components/prompt";
import runCommand, { RunCommandResolved } from "../helpers/commands";
import { ShareableUser } from "../helpers/shareableModel";
import CommandWithCaret from "../components/commandWithCaret";
import Editor from "../components/editor";
import {
  CommandContext,
  CommandType,
  EditorContext,
  EditorContextType,
  UserContext,
  UserType,
} from "./_app";
import loginServerSide, {
  defaultLoginData,
  LoginSSInterface,
} from "../lib/loginServerSide";
import Layout from "../components/layout";
import Output from "../components/output";
import ErrorComponent from "../components/Error";

interface HomeProps {
  initUser: ShareableUser;
  token: string;
}

const Home: NextPage<HomeProps> = ({
  initUser,
  token,
}: HomeProps): JSX.Element => {
  const [user, setUser] = useContext<UserType>(UserContext);
  const {
    command: [command, setCommand],
    caretPosition: [, setCaretPosition],
  } = useContext<CommandType>(CommandContext);
  const cmdInp: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  const caret: MutableRefObject<HTMLSpanElement | null> =
    useRef<HTMLSpanElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [prevCommands, setPrevCommands] = useState<string[]>([]);
  const [prevCommandsIdx, setPrevCommandsIdx] = useState<number>(-1);

  const [path, setPath] = useState("/");

  const [output, setOutput] = useState<ReactNode[]>([<Greeting key={-1} />]);
  const [, setCookies] = useCookies<"jwt", ["jwt"]>(["jwt"]);

  const [editorWindowOpen, setEditorWindowOpen] =
    useContext<EditorContextType>(EditorContext);

  useEffect((): (() => void) => {
    if (token) {
      setCookies("jwt", token);
    }
    return (): void => {};
  }, [token, setCookies]);

  useEffect((): (() => void) => {
    setUser(initUser);
    return (): void => {};
  }, [setUser, initUser]);

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
      behavior: "smooth",
    });
    return (): void => {};
  }, [output, command]);

  useEffect((): (() => void) => {
    if (prevCommandsIdx == -1) {
      setCommand("");
    } else if (prevCommands[prevCommandsIdx]) {
      setCommand(prevCommands[prevCommandsIdx]);
    }
    return (): void => {};
  }, [prevCommandsIdx, prevCommands, setCommand]);

  const addPromptToOutput: (path: string, username: string) => void = (
    path: string
  ): void => {
    setOutput((po: ReactNode[]): ReactNode[] => [
      ...po,
      <div key={po.length} className="flex gap-2">
        <Prompt path={path} />
        <span>{command}</span>
      </div>,
    ]);
    if (command !== prevCommands[prevCommands.length - 1]) {
      setPrevCommands((ppcs: string[]): string[] => [...ppcs, command]);
    }
    if (prevCommandsIdx !== -1) {
      setPrevCommandsIdx(-1);
    }
  };

  const keyUpCaptureHandler: KeyboardEventHandler<HTMLInputElement> = (
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    setCaretPosition(cmdInp.current?.selectionEnd || 0);
  };

  const keyDownHandler: KeyboardEventHandler<HTMLInputElement> = (
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") {
      addPromptToOutput(path, user.username);
      setIsProcessing(true);
      runCommand(command, editorWindowOpen)
        .then(
          ({
            component,
            clear,
            editorWindowOpen: newEditorWindowOpen,
          }: RunCommandResolved): void => {
            {
              if (component) {
                const out: JSX.Element = <Output>{component}</Output>;
                setOutput((po: ReactNode[]): ReactNode[] => [...po, out]);
              }
            }
            if (clear) {
              setOutput([]);
            }
            if (
              newEditorWindowOpen !== undefined &&
              newEditorWindowOpen !== editorWindowOpen
            ) {
              setEditorWindowOpen(newEditorWindowOpen);
            }
          }
        )
        .catch((errorData?: any): void => {
          const err: JSX.Element = (
            <Output>
              <ErrorComponent {...errorData} />
            </Output>
          );
          setOutput((po: ReactNode[]): ReactNode[] => [...po, err]);
        })
        .finally((): void => {
          setIsProcessing(false);
          setCommand("");
        });
      return;
    }
    if ((e.ctrlKey && e.key === "l") || (e.key === "L" && !e.shiftKey)) {
      e.preventDefault();
      setOutput([]);
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
    } else if (
      e.key === "ArrowDown" &&
      !(prevCommandsIdx == prevCommands.length - 1)
    ) {
      e.preventDefault();
      if (prevCommandsIdx < prevCommands.length - 1) {
        setPrevCommandsIdx((pci: number): number => {
          return pci + 1;
        });
      }
    }
  };

  const focusChangeHandler: FocusEventHandler<HTMLInputElement> = (
    e: FocusEvent<HTMLInputElement>
  ): void => {
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
    <Layout title="PHEW">
      {/* cli tab */}
      <label
        htmlFor="cmdinp"
        className={`h-full w-full ${editorWindowOpen && "hidden"}`}
      >
        <div className="h-full">
          <div className="flex flex-col gap-1">
            {output.map((line: ReactNode, idx: number) => {
              return (
                <div
                  className="text-gray-200 whitespace-pre-wrap break-all themed-selection"
                  key={idx}
                >
                  {line}
                </div>
              );
            })}
          </div>
          <div
            className={`flex gap-2 max-h-fit items-baseline ${`${
              isProcessing ? "invisible absolute" : "block"
            }`}}`}
          >
            <Prompt path={path} whenCalledUser={false} />
            <div className="relative">
              <input
                autoCapitalize={"false"}
                autoComplete={"false"}
                autoCorrect={"false"}
                id="cmdinp"
                ref={cmdInp}
                onKeyUpCapture={keyUpCaptureHandler}
                onKeyDown={keyDownHandler}
                onFocus={focusChangeHandler}
                onBlur={focusChangeHandler}
                className="w-2 scale-0 absolute"
                type="text"
                // aria-autocomplete="none"
                // pink;
                value={command}
                onChange={onChangeHandler}
              />
              <CommandWithCaret isFocused={isFocused} ref={caret} />
            </div>
          </div>
          {isProcessing && <Processing />}
        </div>
      </label>
      {/* cli ends */}
      {/* editor component */}
      <Editor
        open={editorWindowOpen}
        placeholder={"// start your phew here."}
      />
    </Layout>
  );
};

export default Home;

export function getServerSideProps({ req }: { req: NextApiRequest }): Promise<{
  props: LoginSSInterface;
}> {
  return new Promise(
    (
      resolve: (value: { props: LoginSSInterface }) => void,
      reject: (reasons?: any) => void
    ): void => {
      loginServerSide(req)
        .then((loginData: LoginSSInterface): void => {
          resolve({
            props: loginData,
          });
        })
        .catch((): void => {
          resolve({
            props: defaultLoginData,
          });
        });
    }
  );
}
