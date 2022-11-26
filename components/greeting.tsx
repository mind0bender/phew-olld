import React, { Dispatch, FC, SetStateAction } from "react";
import Banner from "./banner";
import CommandLink from "./commandLink";
import Output from "./output";

interface GreetingData {
  setCommand: Dispatch<SetStateAction<string>>;
  setCaretPosition: Dispatch<SetStateAction<number>>;
}

const Greeting: FC<GreetingData> = ({
  setCommand,
  setCaretPosition,
}: GreetingData) => {
  return (
    <Output>
      <div key={-1}>
        <div>
          Welcome to <span className="text-teal-300">PHEW</span>
        </div>
        <div>
          Type <CommandLink command="help">help</CommandLink> for more info
        </div>
      </div>
      <br />
      <Banner />
    </Output>
  );
};

export default Greeting;
