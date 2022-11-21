import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ShareableUser } from "../helpers/shareableModel";
import {
  Context,
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { CookiesProvider } from "react-cookie";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  );
}

export default MyApp;
