import React from "react";
import { FC } from "react";

const NotFoundGame: FC = (): JSX.Element => {
  return <iframe className="w-full h-full" src="/game/index.html"></iframe>;
};

export default NotFoundGame;
