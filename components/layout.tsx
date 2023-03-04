import Head from "next/head";
import { FC, HTMLAttributes, useContext, useEffect } from "react";
import { ShareableUser } from "../helpers/shareableModel";
import { UserContext } from "./contextProvider";

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  initUser?: ShareableUser;
}

const Layout: FC<LayoutProps> = ({
  title,
  initUser,
  ...props
}: LayoutProps): JSX.Element => {
  const [user] = useContext(UserContext);

  const rickRollULR: string =
    "data:image/jpeg;base64,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";
  useEffect((): (() => void) => {
    console.log(
      "%c ",
      `padding-left:4rem; padding-top:2rem; background:url("${rickRollULR}"); background-size:4rem; background-repeat:no-repeat;`,
      "\n#rr"
    );

    return (): void => {};
  }, []);

  return (
    <div className="h-full w-full">
      <Head>
        <title>{`${title} ${user.username}`}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="flex flex-col w-full h-full p-2 bg-primary font-extralight font-mono">
        <div className="flex justify-between h-[2rem]">
          <div className="bg-secondary-900 relative select-none text-white px-10 py-1 border-t-2 border-x-2 border-theme-400">
            <span className="absolute -top-0.5 -left-0.5 border-l-theme-400 border-b-transparent border-l-[16px] border-b-[16px]" />
            <span className="absolute -top-0.5 -left-0.5 border-l-primary border-b-transparent border-l-[0.6rem] border-b-[0.6rem]" />
            some-random-process
          </div>
          <div className="grow bg-gradient-to-r from-theme-400 via-primary to-primary pb-[1px]">
            <div className="grow h-full bg-primary" />
          </div>
          <button
            title="not yet pink"
            className="px-2  hover:bg-red-600 text-white text-2xl aspect-square duration-150"
            onClick={(): void => {
              // pink; does nothing yet
            }}>
            x
          </button>
        </div>
        <div className="flex h-[calc(100%-2rem)] grow shadow-2xl shadow-theme-900">
          <div className="px-[0.75px] bg-gradient-to-b from-theme-400 via-primary to-primary" />
          <div className="grow h-full w-full p-1">
            <div className="w-full h-full rounded-sm bg-gradient-to-br from-theme-400 via-primary to-theme-400 p-0.5">
              <div
                {...props}
                className="flex justify-center items-center w-full h-full overflow-y-auto break-all whitespace-pre-wrap scrollbar rounded-sm bg-gradient-to-br via-primary from-[#000000dd] to-[#000000dd] text-white p-2">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
