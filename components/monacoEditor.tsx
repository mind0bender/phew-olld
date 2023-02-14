import React, { useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { FC } from "react";
import mdToHtml from "../helpers/mdtohtml";

interface MonacoEditorProps {
  open: boolean;
  placeholder: string;
}

const MonacoEditor: FC<MonacoEditorProps> = ({
  open,
  placeholder,
}: MonacoEditorProps): JSX.Element => {
  const handleMount: (editor: any, monaco: any) => void = useCallback(
    (editor: any, monaco: any): void => {
      console.log("editor mounted!");
    },
    []
  );

  const [htmlPreview, setHtmlPreview] = useState<string>("");

  const changeHandler: (md: any) => void = useCallback((md: any): void => {
    mdToHtml(md).then(setHtmlPreview).catch(console.error);
  }, []);

  return (
    <div
      className={`${
        open ? "" : "hidden"
      } flex flex-col md:flex-row divide-y md:divide-y-0 divide-x-0 md:divide-x w-full h-full`}
    >
      <div className="h-1/2 md:h-full w-full md:w-1/2">
        <Editor
          defaultLanguage="markdown"
          defaultValue={placeholder}
          className="w-full h-full"
          theme="hc-black"
          onMount={handleMount}
          onChange={changeHandler}
        />
      </div>
      <div
        className={
          `h-1/2 md:h-full md:w-1/2 ` +
          `preview nochildmargin scrollable ` +
          `prose-a:text-indigo-500 prose-blockquote:bg-slate-900 prose prose-blockquote:border-y-2 prose-blockquote:border-y-slate-800`
        }
        dangerouslySetInnerHTML={{ __html: htmlPreview }}
      />
    </div>
  );
};

export default MonacoEditor;
