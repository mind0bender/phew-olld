import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  HTMLAttributes,
  MutableRefObject,
  UIEvent,
  UIEventHandler,
  useRef,
  useState,
} from "react";

interface EditorInterface {
  initContent?: string;
  textAreaProps?: HTMLAttributes<HTMLTextAreaElement>;
  placeholder?: string;
  open: boolean;
}

interface EditorData {
  selection: [number, number];
}

const Editor: FC<EditorInterface> = ({
  initContent = "",
  open,
  textAreaProps = {},
  placeholder = "",
}: EditorInterface): JSX.Element | null => {
  const [content, setCode] = useState<string>(initContent);

  const editorTextArea: MutableRefObject<HTMLTextAreaElement | null> =
    useRef<HTMLTextAreaElement | null>(null);

  const editorDisplay: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);

  const [editorData, setEditorData] = useState<EditorData>({
    selection: [0, 0],
  });

  const onChange: ChangeEventHandler = (
    e: ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setCode(e.target.value);
  };

  const onSelect: () => void = (): void => {
    setEditorData(
      (ped: EditorData): EditorData => ({
        ...ped,
        selection: [
          editorTextArea.current?.selectionStart || 0,
          editorTextArea.current?.selectionEnd || 0,
        ],
      })
    );
  };

  const onScroll: UIEventHandler<HTMLTextAreaElement> = (
    e: UIEvent<HTMLTextAreaElement>
  ): void => {
    editorDisplay.current?.scrollTo(
      editorTextArea.current?.scrollLeft || 0,
      editorTextArea.current?.scrollTop || 0
    );
  };

  return open ? (
    <div className={`flex space-x-4 h-full text-white ${!open && "hidden"}`}>
      <div className="relative w-full h-full">
        <div
          ref={editorDisplay}
          className="absolute w-full overflow-auto h-full grow top-0 left-0 whitespace-pre scrollbar rounded-md bg-primary border-secondary-800 group-focus-within:border-secondary-700  border-2 text-white py-1"
        >
          {content ? (
            <span className="flex">
              <span className="px-2 bg-primary border-r border-secondary-800 sticky left-0">
                {content
                  .split("\n")
                  .map((line: string, lineIdx: number): JSX.Element => {
                    return (
                      <div
                        className="text-end flex whitespace-nowrap text-secondary-400"
                        key={lineIdx}
                      >
                        {lineIdx + 1}
                      </div>
                    );
                  })}
              </span>
              <span className="px-1">
                {content
                  .split("\n")
                  .map((line: string, lineIdx: number): JSX.Element => {
                    const startIdx: number = content
                      .split("\n")
                      .slice(0, lineIdx)
                      .join("\n").length;
                    return (
                      <div
                        className={`rounded-sm px-0.5 ${
                          editorData.selection[0] > startIdx &&
                          editorData.selection[1] <=
                            startIdx + line.length + 1 &&
                          "bg-secondary-800"
                        }`}
                        key={lineIdx}
                      >
                        {line ? (
                          Array.from(line).map(
                            (char: string, charIdx: number) => {
                              return (
                                <span key={charIdx}>
                                  {!charIdx &&
                                    charIdx + startIdx - 1 ==
                                      editorData.selection[0] -
                                        (lineIdx ? 2 : 1) &&
                                    editorData.selection[0] ==
                                      editorData.selection[1] && (
                                      <span className="ring-1 ring-theme-400" />
                                    )}
                                  <span
                                    className={`bg-opacity-40 py-0.5 ${
                                      charIdx + startIdx + (lineIdx ? 2 : 1) >
                                        editorData.selection[0] &&
                                      charIdx + startIdx + (lineIdx ? 1 : 0) <
                                        editorData.selection[1] &&
                                      "bg-theme-400" //class for selection
                                    } ${
                                      (charIdx == 0 ||
                                        charIdx +
                                          startIdx +
                                          (lineIdx ? 2 : 1) ==
                                          editorData.selection[0] + 1) &&
                                      "rounded-l-sm" //class for first characters of selection and selected line
                                    } ${
                                      (charIdx == line.length - 1 ||
                                        charIdx +
                                          startIdx +
                                          (lineIdx ? 1 : 0) ==
                                          editorData.selection[1] - 1) &&
                                      "rounded-r-sm" //class for last characters of selection and selected line
                                    }`}
                                    key={charIdx + startIdx + 1}
                                  >
                                    {charIdx + startIdx + (lineIdx ? 2 : 1) >
                                      editorData.selection[0] &&
                                    charIdx + startIdx + (lineIdx ? 1 : 0) <
                                      editorData.selection[1] ? (
                                      <span
                                        className={`${
                                          char == " " && "text-secondary-900"
                                        }`}
                                      >
                                        {char != " " ? char : "·"}
                                      </span>
                                    ) : (
                                      <span>{char}</span>
                                    )}
                                  </span>
                                  {charIdx + startIdx ==
                                    editorData.selection[0] -
                                      (lineIdx ? 2 : 1) &&
                                    editorData.selection[0] ==
                                      editorData.selection[1] && (
                                      <span className="ring-1 ring-theme-400" />
                                    )}
                                </span>
                              );
                            }
                          )
                        ) : (
                          <>
                            {startIdx == editorData.selection[0] - 1 &&
                              editorData.selection[0] ==
                                editorData.selection[1] && (
                                <span className="ring-1 ring-theme-400" />
                              )}
                            <br />
                          </>
                        )}
                      </div>
                    );
                  })}
              </span>
            </span>
          ) : (
            <>
              <span className="ring-1 ring-theme-400" />
              <span className="text-secondary-500">{placeholder}</span>
            </>
          )}
        </div>
        <span
          className="
           opacity-0
          flex divide-x-2 pl-3 pt-0.5 peer w-full bg-black text-pink-300 h-full absolute top-0 left-0 scrollbar outline-none"
        >
          <span className="pr-2 flex">{content.split("\n").length}</span>
          <textarea
            onScroll={onScroll}
            onSelect={onSelect}
            ref={editorTextArea}
            className="editor px-1 peer whitespace-pre bg-black pl-min-2 pt-1 w-full h-full scrollbar "
            spellCheck={false}
            value={content}
            onChange={onChange}
            {...textAreaProps}
          />
        </span>
      </div>
      <div className="hidden lg:block w-full h-full bg-pink-900"></div>
    </div>
  ) : null;
};

export default Editor;
