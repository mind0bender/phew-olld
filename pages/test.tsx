import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/layout";

const Test: NextPage = (): JSX.Element => {
  return (
    <Layout title="PHEW">
      <Link href="/">Test</Link>
    </Layout>
  );
};

export default Test;
