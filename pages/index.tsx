import { ObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse, NextPage } from "next";
import Head from "next/head";
import {
  ChangeEvent,
  ChangeEventHandler,
  Context,
  createContext,
  Dispatch,
  FocusEvent,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import Greeting from "../components/greeting";
import Processing from "../components/processing";
import { Prompt } from "../components/prompt";
import login from "../controllers/auth/login.controller";
import runCommand from "../helpers/commands";
import { ShareableUser } from "../helpers/shareableModel";
import { verify } from "../lib/jwt";
import validator from "validator";
import CommandWithCaret from "../components/commandWithCaret";
import Editor from "../components/editor";

const { isEmpty } = validator;

export type UserType = [
  ShareableUser,
  Dispatch<SetStateAction<ShareableUser>> | null
];

export const defaultUser: ShareableUser = {
  username: "stem",
  email: "",
};

export const UserContext: Context<UserType> = createContext<UserType>([
  defaultUser,
  null,
]);

export type CommandType = {
  command: [string, Dispatch<SetStateAction<string>> | null];
  caretPosition: [number, Dispatch<SetStateAction<number>> | null];
};

export const defaultCommand: CommandType = {
  command: ["", null],
  caretPosition: [0, null],
};

export const CommandContext: Context<CommandType> =
  createContext<CommandType>(defaultCommand);

interface HomeProps {
  initUser: ShareableUser;
  token: string;
}

const Home: NextPage<HomeProps> = ({
  initUser,
  token,
}: HomeProps): JSX.Element => {
  const [command, setCommand] = useState<string>("");
  const cmdInp: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  const caret: MutableRefObject<HTMLSpanElement | null> =
    useRef<HTMLSpanElement | null>(null);
  const [caretPosition, setCaretPosition] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [prevCommands, setPrevCommands] = useState<string[]>([]);
  const [prevCommandsIdx, setPrevCommandsIdx] = useState<number>(-1);

  const [path, setPath] = useState("/");

  const [user, setUser] = useState<ShareableUser>(initUser);
  const [output, setOutput] = useState<ReactNode[]>([<Greeting key={-1} />]);
  const [, setCookies] = useCookies<"jwt", ["jwt"]>(["jwt"]);

  const [isEditorWindow, setIsEditorWindow] = useState<boolean>(false);

  useEffect((): (() => void) => {
    if (token) {
      setCookies("jwt", token);
    }
    return (): void => {};
  }, [token, setCookies]);

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
  }, [prevCommandsIdx, prevCommands]);

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
      runCommand(command)
        .then((out: ReactNode): void => {
          setOutput((po: ReactNode[]): ReactNode[] => [...po, out]);
        })
        .catch(({ clear, err }: { clear: boolean; err?: any }): void => {
          if (clear) {
            setOutput([]);
          } else {
            setOutput((po: ReactNode[]): ReactNode[] => [...po, err]);
          }
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
    <CommandContext.Provider
      value={{
        command: [command, setCommand],
        caretPosition: [caretPosition, setCaretPosition],
      }}
    >
      <UserContext.Provider value={[user, setUser]}>
        <Head>
          <title>PHEW</title>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicons/favicon-16x16.png"
          />
          <link rel="manifest" href="/favicons/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/favicons/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <meta name="msapplication-TileColor" content="#ffc40d" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <div className="flex flex-col w-full h-screen p-2 bg-primary font-extralight font-mono">
          <div className="flex justify-between rounded-t-lg">
            <div className="bg-secondary-900 select-none text-white px-10 py-1 border-t-2 border-x-2 rounded-t-lg border-secondary-700">
              some-random-process
            </div>
            <div className="grow border-secondary-700 border-b-2" />
            <button
              title="not yet pink"
              className="border-b-2 px-2  hover:bg-red-600 border-secondary-700 text-white text-2xl aspect-square rounded-tr-lg duration-150"
              onClick={(): void => {
                // pink; toggling editor for now
                setIsEditorWindow((iew: boolean): boolean => !iew);
              }}
            >
              x
            </button>
          </div>
          <div className="grow cursor-text bg-secondary-900 h-[calc(100vh-3.5rem)] scrollbar rounded-b-lg p-1 border-x-2 border-b-2 border-secondary-700">
            {/* cli tab */}
            <label
              htmlFor="cmdinp"
              className={`flex group h-full w-full ${
                isEditorWindow && "hidden"
              }`}
            >
              <div className="w-full border border-secondary-700 overflow-y-auto break-all h-full grow whitespace-pre-wrap scrollbar rounded-md bg-primary text-white px-2">
                <input
                  id="cmdinp"
                  ref={cmdInp}
                  onKeyUpCapture={keyUpCaptureHandler}
                  onKeyDown={keyDownHandler}
                  onFocus={focusChangeHandler}
                  onBlur={focusChangeHandler}
                  className="scale-0 absolute"
                  type="text"
                  value={command}
                  onChange={onChangeHandler}
                />
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
                  <Prompt path={path} />
                  <CommandWithCaret isFocused={isFocused} ref={caret} />
                </div>
                {isProcessing && <Processing />}
                {/* pink; editor testing */}
                {/* <Editor initCode="// write your code here" /> */}
              </div>
            </label>
            {/* cli ends */}
            {/* editor component */}
            <Editor
              open={isEditorWindow}
              placeholder={"// start your phew here."}
            />
          </div>
        </div>
      </UserContext.Provider>
    </CommandContext.Provider>
  );
};

export default Home;

export function getServerSideProps({
  req,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: {
    initUser: ShareableUser;
    token: string;
  };
}> {
  return new Promise<{
    props: {
      initUser: ShareableUser;
      token: string;
    };
  }>(
    (
      resolve: (value: {
        props: {
          initUser: ShareableUser;
          token: string;
        };
      }) => void,
      reject: (reason?: any) => void
    ): void => {
      const token: string | undefined = req.cookies.jwt;
      if (token && !isEmpty(token)) {
        verify(token)
          .then(({ _id }: { _id: ObjectId | null }): void => {
            if (_id) {
              login({ _id: String(_id) })
                .then(({ data }: { data: any }): void => {
                  resolve({
                    props: {
                      initUser: data.data.user,
                      token: data.data.token,
                    },
                  });
                })
                .catch((err: any): void => {
                  resolve({
                    props: {
                      initUser: defaultUser,
                      token: "",
                    },
                  });
                });
            } else {
              resolve({
                props: {
                  initUser: defaultUser,
                  token: "",
                },
              });
            }
          })
          .catch((): void => {
            resolve({
              props: {
                initUser: defaultUser,
                token: "",
              },
            });
          });
      } else {
        resolve({
          props: {
            initUser: defaultUser,
            token: "",
          },
        });
      }
    }
  );
}
