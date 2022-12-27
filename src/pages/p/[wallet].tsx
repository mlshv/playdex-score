import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { InventoryItem, Layout } from "../../components";
import { trpc } from "../../utils/trpc";

const ProfilePage = () => {
  const router = useRouter();
  const { wallet } = router.query;

  const profile = trpc.score.getProfile.useQuery(wallet as string, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });

  const renderProfile = () => {
    if (!profile.data) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h1 className="text-3xl">Profile {wallet}</h1>
        <h2 className="text-2xl">Score: {profile.data?.score}</h2>

        {profile.data.actions.length > 0 && (
          <>
            <h2 className="mt-8 text-2xl">Actions</h2>
            <table>
              <thead>
                <tr>
                  <td>Action</td>
                  <td>Score</td>
                </tr>
              </thead>
              <tbody>
                {profile.data.actions.map((action, i) => (
                  <tr key={i}>
                    <td>{action.title}</td>
                    <td>+{action.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {profile.data.ownedTokens.length > 0 && (
          <>
            <h2 className="text-2xl">Inventory</h2>
            {profile.data.ownedTokens
              .filter((token) => token.metadata)
              .map((token, i) => (
                <InventoryItem token={token} key={i} />
              ))}
          </>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Playdex Atlas</title>
        <meta name="description" content="Your Web 3.0 gaming score" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {renderProfile()}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const notFound = typeof params?.wallet !== "string";

  return {
    notFound,
    props: {},
  };
};

export default ProfilePage;
