import { FC } from "react";
import Layout from "../components/layout";
import NotFoundGame from "../components/notfoundgame";

const PageNotFound: FC = () => {
  return (
    <Layout title="Oops! this vanished">
      {/* pink; change title */}

      <NotFoundGame />
    </Layout>
  );
};

export default PageNotFound;
