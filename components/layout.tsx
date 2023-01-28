import Head from "next/head";
import { FC, ReactNode } from "react";

interface LayoutProps {
  title: string;
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({
  children,
  title,
}: LayoutProps): JSX.Element => {
  return (
    <div className="h-full w-full">
      <Head>
        <title>{title}</title>
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
            <span className="absolute -top-0.5 -left-0.5 border-l-primary border-b-transparent border-l-[0.75rem] border-b-[0.75rem]" />
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
            }}
          >
            x
          </button>
        </div>
        <div className="flex h-[calc(100%-2rem)] grow">
          <div className="px-[0.75px] bg-gradient-to-b from-theme-400 via-primary to-primary" />
          <div className="grow h-full scrollbar p-1">
            <div className="w-full h-full rounded-sm bg-gradient-to-br from-theme-400 via-primary to-theme-400 p-0.5">
              <div className="w-full h-full overflow-y-auto break-all whitespace-pre-wrap scrollbar rounded-sm bg-primary text-white p-2">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
