import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import s from "../../styles/SearchExercises.module.scss";
import MiniGymImg from "../../assets/icons/gym.png";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

const SearchExercises = ({ exercises }) => {
  const router = useRouter();
  const [solicitedEx, setSolicitedEx] = useState();
  const [valueSearch, setValueSearch] = useState("");
  const [mql, setMql] = useState();
  const [mqlMid, setMqlMid] = useState();
  const [pagination, setPagination] = useState(1);

  useEffect(() => {
    const mql = matchMedia("(max-width: 500px)");
    setMql(mql.matches);

    const mqlMid = matchMedia("(min-width: 501px) and (max-width: 1024px)");
    setMqlMid(mqlMid.matches);
  }, []);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "962cfbdb5fmsh5b27ca4efda3e13p1fdc82jsn5b500e1cea98",
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    };

    if (router.query.exercise !== undefined) {
      axios
        .request(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${router.query.exercise}`,
          options
        )
        .then((res) => setSolicitedEx(res.data));
    }
  }, [router.query.exercise]);

  const capitaliceFirstLetters = (item) => {
    let realTitle = [];

    item.split("").map((title, i, titleAll) => {
      if (i - 1 === -1) {
        realTitle = [];
        realTitle.push(title.toUpperCase());
      } else {
        realTitle.push(title);
      }
    });

    return realTitle;
  };

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

  const forcePagination = (pag) => {
    const total = pag.length / 9;
    const roundedTotal = Math.round(total);
    const numbs = [];
    const result = [];

    for (let i = 1; numbs.length < roundedTotal; i++) {
      numbs.push(i);
    }

    pag.forEach((el, i) => {
      if (pagination === 1) {
        if (i < 9) {
          result.push(el);
        }
      } else if (i < Number.parseInt(pagination) * 9) {
        if ((Number.parseInt(pagination) - 1) * 9 <= i) {
          result.push(el);
        }
      }
    });

    return {
      last: roundedTotal,
      numbs,
      result,
    };
  };

  const handlerSubmit = (e) => {
    e.preventDefault();
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "3ffa0c33a8msh67f6dbdf63cca39p12bcf6jsn86f0664c5c5b",
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    };
    const muscles = [
      "abductors",
      "abs",
      "adductors",
      "biceps",
      "calves",
      "cardiovascular system",
      "delts",
      "forearms",
      "glutes",
      "hamstrings",
      "lats",
      "levator scapulae",
      "pectorals",
      "quads",
      "serratus anterior",
      "spine",
      "traps",
      "triceps",
      "upper back",
    ];
    const bodyParts = [
      "back",
      "cardio",
      "chest",
      "lower arms",
      "lower legs",
      "neck",
      "shoulders",
      "upper arms",
      "upper legs",
      "waist",
    ];
    let resultMuscles;
    let resultBodyParts;

    valueSearch !== ""
      ? (resultMuscles = muscles.find((el) => el.startsWith(valueSearch)))
      : null;

    valueSearch !== ""
      ? (resultBodyParts = bodyParts.find((el) => el.startsWith(valueSearch)))
      : null;

    if (resultMuscles !== undefined) {
      axios
        .request(
          `https://exercisedb.p.rapidapi.com/exercises/target/${resultMuscles}`,
          options
        )
        .then((res) => setSolicitedEx(res.data));
    } else if (resultMuscles === undefined && resultBodyParts !== undefined) {
      axios
        .request(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${resultBodyParts}`,
          options
        )
        .then((res) => setSolicitedEx(res.data));
    }
  };

  return (
    <div className={s.container}>
      <div>
        <h2>Awesome Exercises You Should Know</h2>

        <form onSubmit={handlerSubmit}>
          <input
            type="search"
            name="search"
            placeholder="Search By Muscle"
            value={valueSearch}
            onChange={(e) => setValueSearch(e.target.value)}
            autoComplete="off"
          />
          <button>Search</button>
        </form>
      </div>

      <div>
        <Swiper spaceBetween={50} slidesPerView={mql ? 1 : mqlMid ? 3 : 4} loop={true}>
          {exercises !== undefined
            ? exercises.map((exercise, i) => {
                return (
                  <SwiperSlide
                    className={`${s.swiper_slide_se} ${
                      router.query.exercise === exercise
                        ? s.se_active
                        : console.log()
                    }`}
                    onClick={() => {
                      router.push(
                        `?exercise=${exercise}`,
                        `?exercise=${exercise}`,
                        { scroll: false }
                      );
                    }}
                    key={i}
                  >
                    <img src={MiniGymImg.src} alt="" />
                    <h2>{capitaliceFirstLetters(exercise)}</h2>
                  </SwiperSlide>
                );
              })
            : null}
        </Swiper>
      </div>

      <div>
        <h2>Showing Results</h2>
        <div>
          {solicitedEx !== undefined
            ? forcePagination(solicitedEx).result.map((solEx, i) => {
                return (
                  <div
                    key={solEx.id}
                    onClick={() =>
                      router.push(
                        `${solEx.name.replaceAll(" ", "_")}~${solEx.id}`
                      )
                    }
                  >
                    <img src={solEx.gifUrl} alt={solEx.name} />
                    <div>
                      <span>{capitaliceFirstLetters(solEx.bodyPart)}</span>
                      <span>{capitaliceFirstLetters(solEx.target)}</span>
                    </div>
                    <div>
                      <h3>{capitaliceAllLetters(solEx.name)}</h3>
                    </div>
                  </div>
                );
              })
            : null}
        </div>

        <div>
          {solicitedEx !== undefined ? (
            forcePagination(solicitedEx).last !== 0 ? (
              <>
                {pagination !== 1 ? (
                  <div onClick={() => setPagination(pagination - 1)}>
                    <AiOutlineLeft />
                  </div>
                ) : null}

                {solicitedEx !== undefined ? (
                  pagination !== 1 &&
                  pagination - 1 !== 1 &&
                  pagination - 2 !== 1 ? (
                    <>
                      <div onClick={() => setPagination(1)}>
                        <span>{1}</span>
                      </div>
                    </>
                  ) : null
                ) : null}

                {solicitedEx !== undefined
                  ? forcePagination(solicitedEx).numbs.map((el, i) => {
                      if (
                        el === pagination - 1 ||
                        el === pagination - 2 ||
                        el === pagination ||
                        el === pagination + 1 ||
                        el === pagination + 2
                      ) {
                        return (
                          <div key={el}>
                            <div
                              className={
                                el === pagination ? s.cat_active : null
                              }
                              onClick={() => setPagination(el)}
                            >
                              <span>{el}</span>
                            </div>
                          </div>
                        );
                      }
                    })
                  : null}

                {solicitedEx !== undefined ? (
                  pagination !== forcePagination(solicitedEx).last &&
                  pagination + 1 !== forcePagination(solicitedEx).last &&
                  pagination + 2 !== forcePagination(solicitedEx).last ? (
                    <>
                      <div
                        onClick={() =>
                          setPagination(forcePagination(solicitedEx).last)
                        }
                      >
                        <span>{forcePagination(solicitedEx).last}</span>
                      </div>
                    </>
                  ) : null
                ) : null}

                {solicitedEx !== undefined ? (
                  pagination !== forcePagination(solicitedEx).last ? (
                    <div onClick={() => setPagination(pagination + 1)}>
                      <AiOutlineRight />
                    </div>
                  ) : null
                ) : null}
              </>
            ) : null
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchExercises;
