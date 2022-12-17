import React, { Dispatch, FC, SetStateAction } from "react";
import Banner from "./banner";
import CommandLink from "./commandLink";
import Output from "./output";

const Greeting: FC = (): JSX.Element => {
  return (
    <Output>
      <div key={-1}>
        <div>
          Welcome to <span className="text-theme-400">PHEW</span>
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
