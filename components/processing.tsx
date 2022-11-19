import React, { useEffect, useState } from "react";
import Output from "./output";

const frames: string[] = [
  "['  ]",
  "[ ' ]",
  "[  ']",
  "[  -]",
  "[  _]",
  "[ _ ]",
  "[_  ]",
  "[-  ]",
];

function Processing() {
  const [frame, setframe] = useState<number>(0);
  useEffect((): (() => void) => {
    const interval = setInterval((): void => {
      setframe((pp: number): number => pp + 1);
    }, 150);

    return (): void => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Output>
      <div>Your request is being precessed</div>
      <div className="whitespace-pre">{`${"[".repeat(frame % frames.length)}${
        frames[frame % frames.length]
      }${"]".repeat(frames.length - (frame % frames.length) - 1)}`}</div>
    </Output>
  );
}

export default Processing;
