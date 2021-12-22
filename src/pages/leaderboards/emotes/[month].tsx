import { GetServerSideProps } from "next";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import Heading from "../../../components/Heading";
import Leaderboard from "../../../components/Leaderboard/Leaderboard";
import TableText from "../../../components/Leaderboard/TableText";
import { Emote } from "../../../types/types";
// Types -------------------------------------------------------------------------

interface Props {
  emotes: Emote[];
  count: number;
}

// Component ---------------------------------------------------------------------
const TopEmotesPage: React.FC<Props> = ({ emotes, count }) => {
  console.log(count);
  const [data, setData] = React.useState(emotes);
  const [loading, setLoading] = React.useState(true);
  const [pageCount, setPageCount] = React.useState(count);
  const fetchIdRef = React.useRef(0);
  // const data = useMemo(() => emotes, [emotes]);

  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "position",
        collapse: true,
        className: "place",
        width: 60,
      },
      {
        Header: "Nick",
        accessor: "name",
        className: "name",
        width: "100%",
        // @ts-ignore
        Cell: ({ value, row: { original } }) => {
          return <TableText text={value} emote={original.url} />;
        },
      },
      {
        Header: "Messages\nCount",
        accessor: "count",
        className: "count",
        collapse: true,
        // width: ,
        minWidth: 100,
        maxWidth: 150,
        // @ts-ignore
        Cell: ({ value }) => {
          return value.toLocaleString("en-US");
        },
      },
    ],
    []
  );

  const fetchData = useCallback(async ({ pageIndex, query, setErr }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);

    if (fetchId === fetchIdRef.current) {
      console.log("hello");
      try {
        const res = await fetch(
          `https://capi.vopp.top/emotes/page/${pageIndex}?name=${query || ""}`
        ).then((res) => {
          if (res.status === 404) throw new Error();
          return res.json();
        });

        if (res) {
          setData(res.emotes);
          setPageCount(res.maxIndex + 1);
        }
      } catch {
        setErr(true);
      }
    }

    setLoading(false);
  }, []);

  return (
    <>
      <Heading mb={0}>Top Emotes</Heading>
      <Leaderboard
        searchType="emotes"
        data={data}
        columns={columns}
        fetchData={fetchData}
        pageCount={pageCount}
        loading={loading}
        pagination={true}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const res = await fetch(`https://capi.vopp.top/emotes/page/0`)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  return { props: { emotes: res.emotes, count: res.maxIndex + 1 } };
};

export default TopEmotesPage;

// Styled ------------------------------------------------------------------------

const Wrapper = styled.div``;
