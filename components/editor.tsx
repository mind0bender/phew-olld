import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  MutableRefObject,
  UIEvent,
  UIEventHandler,
  useRef,
  useState,
} from "react";

interface EditorInterface {
  initContent: string;
  open: boolean;
}

interface EditorData {
  selection: [number, number];
  scrollY: number;
}

const Editor: FC<EditorInterface> = ({
  initContent,
  open,
}: EditorInterface): JSX.Element => {
  const [content, setCode] = useState<string>(initContent);

  const editorTextArea: MutableRefObject<HTMLTextAreaElement | null> =
    useRef<HTMLTextAreaElement | null>(null);

  const editorDisplay: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);

  const [editorData, setEditorData] = useState<EditorData>({
    selection: [0, 0],
    scrollY: 0,
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
    editorDisplay.current?.scrollTo(0, editorTextArea.current?.scrollTop || 0);
  };

  return (
    <div className={`relative group h-full text-white ${!open && "hidden"}`}>
      <div
        ref={editorDisplay}
        className="absolute overflow-auto h-full grow top-0 left-0 whitespace-pre-wrap w-full min-h-[10rem] scrollbar shadow-inner outline-none ring-secondary-700 group-focus:ring-2 rounded-sm bg-secondary-900 text-white py-1 px-3"
      >
        {content
          .split("\n")
          .map((line: string, lineIdx: number): JSX.Element => {
            const startIdx: number = content
              .split("\n")
              .slice(0, lineIdx)
              .join("\n").length;
            return (
              <div className={"pink;" + editorData.selection[0]} key={lineIdx}>
                {Array.from(line).map((char: string, charIdx: number) => {
                  return (
                    <>
                      {charIdx + startIdx == editorData.selection[0] - 1 &&
                        charIdx + startIdx == editorData.selection[1] - 1 && (
                          <span className="ring-1 ring-theme-400" />
                        )}
                      <span
                        className={`bg-opacity-40 py-0.5 ${
                          charIdx + startIdx + (lineIdx ? 2 : 1) >
                            editorData.selection[0] &&
                          charIdx + startIdx + (lineIdx ? 1 : 0) <
                            editorData.selection[1] &&
                          "bg-theme-400" //class for selection
                        } 
                      ${
                        (charIdx == 0 ||
                          charIdx + startIdx + (lineIdx ? 2 : 1) ==
                            editorData.selection[0] + 1) &&
                        "rounded-l-sm" //class for first characters of selection and selected line
                      } ${
                          (charIdx == line.length - 1 ||
                            charIdx + startIdx + 1 ==
                              editorData.selection[1] - 1) &&
                          "rounded-r-sm" //class for last characters of selection and selected line
                        }`}
                        key={charIdx + startIdx + 1}
                      >
                        {char || startIdx + ""}
                      </span>
                    </>
                  );
                })}
              </div>
            );
          })}
      </div>
      <textarea
        onScroll={onScroll}
        onSelect={onSelect}
        ref={editorTextArea}
        className="editor w-full bg-none h-full absolute top-0 left-0 opacity-0 min-h-[10rem] scrollbar shadow-inner outline-none ring-secondary-700 group-focus:ring-2 rounded-sm py-1 px-3"
        spellCheck={false}
        value={content}
        onChange={onChange}
      />
    </div>
  );
};

export default Editor;
