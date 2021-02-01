import ReactWeather from "react-open-weather-widget";
import "react-open-weather/lib/css/ReactWeather.css";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import Confetti from "react-confetti";
import ReactDOM from "react-dom";
import FancyTime from "./fancyClock/FancyTime";
import Quote from "./Quote";
import Clock from "react-live-clock";
import { Wave } from "react-animated-text";
import { styles, getStyle } from "./styles";

import io from "socket.io-client";

import "./styles.css";
import "./text.css";
import { ParticleShape } from "react-confetti/src/Particle";

const imageVariant = {
  invisible: {
    opacity: 0
  },
  visible: {
    opacity: 1
    // opacity: [0.4, 1],
    // y: ["-25%", "0%"],
    // transition: {
    //   duration: 7,
    //   times: [0, 1]
    // }
  }
};

const animationVariant = {
  invisible: {
    opacity: 0
  },
  visible: {
    opacity: 1
    // opacity: [0.4, 0.9, 1],
    // y: ["25%", "10%", "0%"],
    // transition: {
    //   duration: 15,
    //   times: [0, 0.3, 1]
    // }
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default function App() {
  const [hour1, setHour1] = React.useState(0);
  const [hour2, setHour2] = React.useState(0);
  const [minute1, setMinute1] = React.useState(0);
  const [minute2, setMinute2] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [lastCoffeeTime, setLastCoffeeTime] = React.useState(new Date());
  const socketRef = React.useRef(null);
  const [weatherDate, setWeatherDate] = React.useState("5days");
  const [animationTarget, setAnimationTarget] = React.useState({
    h1: "visible",
    title: "visible",
    coffeeTime: "visible",
    image: "visible",
    weather: "visible"
  });
  const [coffeeFreshness, setCoffeeFreshness] = React.useState(0);
  const [siteStyle, setSiteStyle] = React.useState(styles[0]);

  const Screenmove = async () => {
    await setAnimationTarget({
      h1: "invisible",
      coffeeTime: "invisible",
      image: "invisible",
      weather: "invisible",
      title: "invisible"
    });
    await sleep(1000);
    await await setAnimationTarget({
      h1: "visible",
      coffeeTime: "visible",
      image: "visible",
      weather: "visible",
      title: "visible"
    });
  };

  const UpdateFreshness = (diffTimeInMs) => {
    const minutes = Math.floor(diffTimeInMs / (1000 * 60));
    const normalized = minutes / 30;
    const freshness = Math.exp(-2 * normalized * normalized);
    setCoffeeFreshness(freshness);
  };

  const SetTime = (coffeeDate, currentDate) => {
    if (!coffeeDate || !currentDate) {
      return;
    }
    const diffTime = Math.abs(currentDate - coffeeDate);
    const diffMinutes = Math.floor((diffTime / (1000 * 60)) % 60);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const dateHour = "0" + diffHours;
    setHour1(parseInt(dateHour[dateHour.length - 1], 10));
    setHour2(parseInt(dateHour[dateHour.length - 2], 10));
    const dateMinute = "0" + diffMinutes;
    setMinute1(parseInt(dateMinute[dateMinute.length - 1], 10));
    setMinute2(parseInt(dateMinute[dateMinute.length - 2], 10));

    UpdateFreshness(diffTime);
  };

  const ResetTime = () => {
    setHour2(0);
    setHour1(0);
    setMinute2(0);
    setMinute1(0);
  };

  useEffect(() => {
    const socket = io("https://delicate-firefly-5545.fly.dev/");
    socketRef.current = socket;
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    const screenMove = setInterval(() => {
      Screenmove();
      setWeatherDate("5days");
    }, 99000);
    socket.on("refresh", (data) => {
      console.log("refresh!");
      ResetTime();
      setLastCoffeeTime(new Date());
    });
    socket.on("refreshClients", (data) => {
      console.log("refresh client!");
      window.location.reload();
    });
    socket.on("setStyle", (data) => {
      console.log("setStyle", data);
      if (data.styleName) {
        let newStyle = getStyle(data.styleName);
        if (newStyle) {
          setSiteStyle(newStyle);
        }
      } else if (data.customStyle) {
        setSiteStyle(data.customStyle);
      }
    });
    // Get the current lastCoffeeTime.
    fetch("https://api.5-2unlimited.com/koffieknop")
      .then((data) => {
        return data.json();
      })
      .then(async (res) => {
        const newDate = new Date(res.time);
        setLastCoffeeTime(newDate);
      });
    return () => {
      clearInterval(clockInterval);
      clearInterval(screenMove);
    };
  }, []);

  useEffect(() => {
    // Updates whenever the last coffee time changes.
    // We should redraw.
    SetTime(lastCoffeeTime, currentTime);
  }, [lastCoffeeTime, currentTime]);

  useEffect(() => {
    // Update every time the currentTime changes.
    // This changes the style based on periods.
    let newStyle;
    if (currentTime.getMonth() === 11) {
      newStyle = getStyle("kerst");
    } else if (currentTime.getMonth() === 8) {
      newStyle = getStyle("blue");
    } else {
      newStyle = getStyle("huisstijl");
    }
    setSiteStyle((style) => (style.name !== newStyle ? newStyle : style));
  }, [currentTime]);

  const confettiOpacity = Math.max(0, (coffeeFreshness - 0.6) * 3.5);

  return (
    <div
      className="App Kerst"
      style={{
        ...siteStyle.styles,
        overflow: "hidden"
      }}
    >
      {coffeeFreshness > 0.5 && (
        <Confetti
          colors={siteStyle.confetti.colors}
          opacity={confettiOpacity}
          numberOfPieces={confettiOpacity * 200}
          wind={Math.max(0, 0.5 - confettiOpacity)}
          drawShape={siteStyle.confetti.drawShape}
        />
      )}
      <div style={{ height: "90vh" }}>
        <motion.h1 variants={animationVariant} animate={animationTarget.h1}>
          5-2 Unlimited
        </motion.h1>
        <motion.div
          variants={animationVariant}
          animate={animationTarget.title}
          style={{
            transform: "scale(0.5)",
            marginLeft: "-2rem",
            marginRight: "-2rem",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Quote text="Koffie knop" />
        </motion.div>

        <motion.div
          variants={animationVariant}
          animate={animationTarget.coffeeTime}
          style={{ marginTop: "3rem" }}
        >
          <FancyTime number={hour2} />
          <FancyTime number={hour1} />
          H
          <FancyTime number={minute2} />
          <FancyTime number={minute1} />M
          <div style={{ margin: "4rem", fontSize: "3rem" }}>
            <Wave
              text="PLAT!"
              effect="stretch"
              effectChange={1.5}
              effectDuration={0.7}
            />
          </div>
        </motion.div>

        <motion.img
          variants={imageVariant}
          animate={animationTarget.image}
          alt="Huis logo"
          src="logo.jpeg"
          style={{
            marginTop: "2rem",
            width: "20vw",
            left: "1.5rem",
            position: "absolute",
            bottom: "1.5rem",
            borderRadius: "4px"
          }}
        />

        <motion.img
          variants={imageVariant}
          animate={animationTarget.image}
          alt="Joost (onze kat)"
          src="joost.jpg"
          style={{
            marginTop: "2rem",
            width: "20vw",
            right: "1.5rem",
            position: "absolute",
            bottom: "1.5rem",
            borderRadius: "4px",
            radius: "8px"
          }}
        />
      </div>
      <motion.div
        variants={imageVariant}
        animate={animationTarget.weather}
        style={{
          minWidth: "fit-content",
          maxWidth: "800px",
          position: "absolute",
          bottom: "1rem",
          left: "1rem"
        }}
      ></motion.div>
      <motion.div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          fontSize: "1.5em"
        }}
      >
        <Clock timezone="Europe/Amsterdam" ticking interval={20} />
      </motion.div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
