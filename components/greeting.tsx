import React, { Dispatch, FC, SetStateAction } from "react";
import Banner from "./banner";

interface GreetingData {
  setCommand: Dispatch<SetStateAction<string>>;
  setCaretPosition: Dispatch<SetStateAction<number>>;
}

const Greeting: FC<GreetingData> = ({
  setCommand,
  setCaretPosition,
}: GreetingData) => {
  return (
    <div>
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
      </div>
      <br />
      <Banner />
    </div>
  );
};

export default Greeting;
