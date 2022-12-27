import { NextRouter, useRouter } from "next/router";
import { FC, useEffect } from "react";

interface NavigateToProps {
  to: string;
}

const NavigateTo: FC<NavigateToProps> = ({ to }: NavigateToProps) => {
  const router: NextRouter = useRouter();
  useEffect(() => {
    router.push(to);

    return () => {};
  }, []);

  return <></>;
};

export default NavigateTo;
