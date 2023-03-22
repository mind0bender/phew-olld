import { FC, memo, NamedExoticComponent, useEffect, useState } from "react";
import mdToHtml from "../helpers/mdtohtml";

interface PreviewProps {
  markdown: string;
}

const Preview: FC<PreviewProps> = ({ markdown }: PreviewProps): JSX.Element => {
  const [HTMLPreview, setHTMLPreview] = useState("");

  useEffect((): (() => void) => {
    mdToHtml(markdown)
      .then((generatedHTML: string): void => {
        setHTMLPreview(generatedHTML);
      })
      .catch(console.error);
    return (): void => {};
  }, [markdown]);

  console.log("preview was rendered");

  return (
    <div
      className={
        `preview overflow-auto nochildmargin py-4 px-8 flex flex-col scrollable h-full w-full` +
        `prose-a:text-indigo-500 prose-li:list-inside prose-blockquote:bg-slate-900 prose prose-blockquote:border-y-2 prose-blockquote:border-y-slate-800`
      }
      dangerouslySetInnerHTML={{ __html: HTMLPreview }}
    />
  );
};

const MemoizedPreview: NamedExoticComponent<PreviewProps> = memo(Preview);

export default MemoizedPreview;
