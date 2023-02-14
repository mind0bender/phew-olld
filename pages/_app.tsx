import "../styles/globals.css";
import type { AppProps } from "next/app";
import ContextProvider from "../components/contextProvider";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  );
}

export default MyApp;
