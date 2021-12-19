import type { GetStaticProps, NextPage } from "next";
import styled from "styled-components";
import Heading from "../components/Heading";
import TopEmotesLeaderboard from "../components/Home/TopEmotesLeaderboard";
import TopStreamersLeaderboard from "../components/Home/TopStreamersLeaderboard";
import TopUsersLeaderboard from "../components/Home/TopUsersLeaderboard";
import Loader from "../components/Loader";
import Text from "../components/Text";
import { IGlobal } from "../types/types";
import { Leaderboards } from "./streamer/[username]";
// import Head from "next/head";

interface Props {
  data: IGlobal;
}

export const server =
  "undefined" === typeof window ? "http://localhost:3000" : "https://vopp.top";

const Home: NextPage<Props> = ({ data }) => {
  if (!data) return <Loader />;

  return (
    <Wrapper>
      <Heading mb={50}>
        Leaderboard{" "}
        <Text as={"span"} fontWeight={500} fontSize={"lg"} textColor={"main"}>
          /Nov
        </Text>
      </Heading>
      <Leaderboards>
        <TopUsersLeaderboard users={data.users} />
        <TopEmotesLeaderboard emotes={data.emotes} />
      </Leaderboards>
      <Heading my={50} mb={50}>
        Top Streamers{" "}
        <Text as={"span"} fontWeight={500} fontSize={"lg"} textColor={"main"}>
          /Nov
        </Text>
      </Heading>
      <TopStreamersLeaderboard streamers={data.streamers} />
    </Wrapper>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await fetch(`${server}/static/__global__/index.json`)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  return { props: { data } };
};

export default Home;

const Wrapper = styled.div``;
