import axios from "axios";
import Head from "next/head";
import FirstPart from "../components/Home/FirstPart";
import SearchExercises from "../components/Home/SearchExercises";

export default function Home({ exercises }) {
  return (
    <>
      <Head>
        <title>Golds Gym</title>
      </Head>

      <main>
        <FirstPart />
        <SearchExercises exercises={exercises} />
      </main>
    </>
  );
}

export async function getStaticProps() {
  const options = {
    method: "GET",
    url: "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
    headers: {
      "X-RapidAPI-Key": "962cfbdb5fmsh5b27ca4efda3e13p1fdc82jsn5b500e1cea98",
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };

  const res = await axios.request(options);

  return {
    props: {
      exercises: res.data,
    },
    revalidate: 86400,
  };
}
