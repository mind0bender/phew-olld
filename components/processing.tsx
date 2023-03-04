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

interface ProcessingProps {
  fixed?: boolean;
  msg?: string;
  onUnmount?: () => void;
}

const Processing: FC<ProcessingProps> = ({
  fixed = true,
  msg = `Your request is being processed`,
  onUnmount,
}: ProcessingProps): JSX.Element => {
  const [frame, setframe] = useState<number>(0);

  useEffect((): (() => void) => {
    const interval: NodeJS.Timer = setInterval((): void => {
      setframe((pp: number): number => pp + 1);
    }, 150);

    return (): void => {
      clearInterval(interval);
      if (onUnmount) {
        onUnmount();
      }
    };
  }, [onUnmount]);

  return (
    <Output>
      <div className={`w-fit ${fixed && "fixed bottom-8 right-8"}`}>
        <div>{msg}</div>
        <div className="flex gap-2 justify-between">
          <div className="whitespace-pre">{frames[frame % frames.length]}</div>
          <div
            className={`${
              (frame * 150) / 1000 > 120 ? "text-red-500" : "text-green-500"
            } whitespace-nowrap`}>
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
