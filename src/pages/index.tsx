import { type NextPage } from "next";
import Head from "next/head";

import { Layout } from "../components";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.name) {
      router.replace(`/p/${session.user.name}`);
    }
  }, [router, status, session?.user?.name]);

  return (
    <Layout>
      <Head>
        <title>Playdex Atlas</title>
        <meta name="description" content="Your Web 3.0 gaming score" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div></div>
    </Layout>
  );
};

export default Home;
