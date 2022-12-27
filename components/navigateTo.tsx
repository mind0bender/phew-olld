import { NextRouter, useRouter } from "next/router";
import { FC, useEffect } from "react";

interface NavigateToProps {
  to: string;
}

const NavigateTo: FC<NavigateToProps> = ({ to }: NavigateToProps) => {
  const router: NextRouter = useRouter();
  useEffect((): (() => void) => {
    router.push(to);

    return (): void => {};
  });

  return <></>;
};

export default NavigateTo;
