const backColor1 = "--backColor1";
const backColor2 = "--backColor2";
const frontColor = "--frontColor";

const kerst = {
  name: "kerst",
  styles: {
    [backColor1]: "#c7453c",
    [backColor2]: "#961f17",
    [frontColor]: "white"
  },
  confetti: {
    colors: ["#ede2e1", "#dedad9", "#f2f0f0"],
    drawShape: (ctx) => {
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
};

const blue = {
  name: "blue",
  styles: {
    [backColor1]: "#53a0fd",
    [backColor2]: "#01c2f3",
    [frontColor]: "white"
  },
  confetti: {
    colors: [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548"
    ],
    drawShape: undefined
  }
};

const huisstijl = {
  name: "huisstijl",
  styles: {
    [backColor1]: "#7d715b",
    [backColor2]: "#5c513f",
    [frontColor]: "#e1b641"
  },
  confetti: {
    colors: [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548"
    ],
    drawShape: undefined
  }
};

export const styles = [blue, kerst, huisstijl];
export const getStyle = (styleName) => {
  return styles.find((style) => style.name === styleName);
};
