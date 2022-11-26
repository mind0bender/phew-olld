import React, { FC, useEffect, useState } from "react";
import Output from "./output";

const frames: string[] = [
  "[`  ][][][][][][]]",
  "[[ ` [][][][][][]]",
  "[[]  `][][][][][]]",
  "[[][  -[][][][][]]",
  "[[][]  _][][][][]]",
  "[[][][ _ [][][][]]",
  "[[][][]_  ][][][]]",
  "[[][][][-  [][][]]",
  "[[][][][]`  ][][]]",
  "[[][][][][ ` [][]]",
  "[[][][][][]  `][]]",
  "[[][][][][][  -[]]",
  "[[][][][][][]  _]]",
  "[[][][][][][][ _ ]",
  "[ [][][][][][][_ ]",
  "[  [][][][][][][-]",
];

const Processing: FC = (): JSX.Element => {
  const [frame, setframe] = useState<number>(0);

  useEffect((): (() => void) => {
    const interval: NodeJS.Timer = setInterval((): void => {
      setframe((pp: number): number => pp + 1);
    }, 150);

    return (): void => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Output>
      <div className="max-w-fit">
        <div>Your request is being processed</div>
        <div className="flex justify-between">
          <div className="whitespace-pre">{frames[frame % frames.length]}</div>
          <div
            className={`${
              (frame * 150) / 1000 > 120 ? "text-red-500" : "text-green-500"
            }`}
          >
            {Math.floor((frame * 150) / 1000)}s
          </div>
        </div>
        {Math.floor((frame * 150) / 1000) > 120 && (
          <div className="text-red-500 text-sm">
            This is taking longer than usual.
          </div>
        )}
      </div>
    </Output>
  );
};

export default Processing;
