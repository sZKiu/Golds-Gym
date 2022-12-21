import React from "react";
import Logo from "../../assets/images/Logo.png";
import Banner from "../../assets/images/banner.png";
import s from "../../styles/FirstPart.module.scss";

const FirstPart = () => {
  return (
    <div className={s.container} >
      <div>
        <div>
          <img src={Logo.src} alt="Logo" />

          <ul>
            <li>Home</li>
            <li>Exercises</li>
          </ul>
        </div>

        <div>
          <h2>Fitness Club</h2>
          <h1>Sweat, Smile and Repeat</h1>
          <p>Check out the most effective exercises for you</p>
          <button>Explore Exercises</button>
        </div>
      </div>

      <div>
        <img className={s.banner} src={Banner.src} alt="banner" />
      </div>
    </div>
  );
};

export default FirstPart;
