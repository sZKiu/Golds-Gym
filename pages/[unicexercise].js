import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Logo from "../assets/images/Logo.png";
import BodyPart from "../assets/icons/body-part.png";
import Equipment from "../assets/icons/equipment.png";
import Target from "../assets/icons/target.png";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import s from "../styles/UnicExercises.module.scss";

export default function UnicExercice({ ex, ytVideos }) {
  let exerciseCapitalizeName;
  const router = useRouter();
  const [mql, setMql] = useState();
  const [mqlMid, setMqlMid] = useState();

  useEffect(() => {
    const mql = matchMedia("(max-width: 500px)");
    setMql(mql.matches);

    const mqlMid = matchMedia("(min-width: 501px) and (max-width: 1024px)");
    setMqlMid(mqlMid.matches);
  }, []);
  const capitaliceAllLetters = (item) => {
    let realTitle = [];

    item.split("").map((title, i, titleAll) => {
      if (i - 1 === -1) {
        realTitle = [];
        realTitle.push(title.toUpperCase());
      } else if (titleAll[i - 1] === " ") {
        realTitle.push(title.toUpperCase());
      } else {
        realTitle.push(title);
      }
    });

    return realTitle;
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  router.query.unicexercise !== undefined
    ? (exerciseCapitalizeName = capitaliceAllLetters(
        router.query.unicexercise.split("~")[0].replaceAll("_", " ")
      ).join(""))
    : null;

  return (
    <div className={s.container}>
      <Head>
        <title>{`Golds Gym ~ ${exerciseCapitalizeName}`}</title>
      </Head>

      <header className={s.header}>
        <img src={Logo.src} alt="Logo" />

        <ul>
          <li>Home</li>
          <li>Exercises</li>
        </ul>
      </header>

      <main className={s.main}>
        <section>
          <div>
            <img src={ex.gifUrl} alt="" />
          </div>

          <div>
            <h1>{capitaliceAllLetters(ex.name)}</h1>

            <p>{`Exercises keep you strong. ${capitaliceAllLetters(
              ex.name
            ).join("")} is one of the best exercises to target your ${
              ex.bodyPart
            }. It will help you improve your mood and gain energy.`}</p>

            {mqlMid ? (
              <div>
                <div>
                  <div>
                    <img src={BodyPart.src} alt={`A logo about ${ex.target}`} />
                  </div>
                  <span>{capitaliceAllLetters(ex.target)}</span>
                </div>

                <div>
                  <div>
                    <img src={Target.src} alt={`A logo about ${ex.bodyPart}`} />
                  </div>
                  <span>{capitaliceAllLetters(ex.bodyPart)}</span>
                </div>

                <div>
                  <div>
                    <img
                      src={Equipment.src}
                      alt={`A logo about ${ex.equipment}`}
                    />
                  </div>
                  <span>{capitaliceAllLetters(ex.equipment)}</span>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div>
                    <img src={BodyPart.src} alt={`A logo about ${ex.target}`} />
                  </div>
                  <span>{capitaliceAllLetters(ex.target)}</span>
                </div>

                <div>
                  <div>
                    <img src={Target.src} alt={`A logo about ${ex.bodyPart}`} />
                  </div>
                  <span>{capitaliceAllLetters(ex.bodyPart)}</span>
                </div>

                <div>
                  <div>
                    <img
                      src={Equipment.src}
                      alt={`A logo about ${ex.equipment}`}
                    />
                  </div>
                  <span>{capitaliceAllLetters(ex.equipment)}</span>
                </div>
              </>
            )}
          </div>
        </section>

        <section>
          <h2>
            Watch <span>{exerciseCapitalizeName}</span> exercise videos
          </h2>
          <Swiper
            spaceBetween={40}
            slidesPerView={mql ? 1 : mqlMid ? 2 : 3}
            loop={true}
          >
            {ytVideos.map(({ img, title, channelName, videoId }) => {
              const YT_URL = "https://www.youtube.com/watch";

              return (
                <SwiperSlide
                  key={videoId}
                  onClick={() =>
                    openInNewTab(
                      `${YT_URL}?v=${videoId}&ab_channel=${channelName}`
                    )
                  }
                >
                  <img
                    src={img[1] !== undefined ? img[1].url : img[0].url}
                    alt={title}
                  />
                  <h2>{title}</h2>
                  <span>{channelName}</span>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const opIndividualData = {
    method: "GET",
    url: `https://exercisedb.p.rapidapi.com/exercises/exercise/${
      context.query.unicexercise.split("~")[1]
    }`,
    headers: {
      "X-RapidAPI-Key": "962cfbdb5fmsh5b27ca4efda3e13p1fdc82jsn5b500e1cea98",
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };
  const resIndividualData = await axios.request(opIndividualData);

  const youtubeSearchUrl =
    "https://youtube-search-and-download.p.rapidapi.com/search";

  const opYoutubeExercises = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "f8bd9615e2msha491048fcacc91bp1e62dfjsnf28c73978dc5",
      "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
    },
  };

  const resYoutubeExercises = await axios.request(
    `${youtubeSearchUrl}?query=${context.query.unicexercise
      .split("~")[0]
      .replaceAll("_", "")} exercises`,
    opYoutubeExercises
  );

  const ytVideos = resYoutubeExercises.data.contents.map(({ video }) => {
    const { channelName, title, thumbnails, videoId } = video;
    return {
      channelName,
      title,
      img: thumbnails,
      videoId,
    };
  });

  return {
    props: {
      ex: resIndividualData.data,
      ytVideos,
    },
  };
}
