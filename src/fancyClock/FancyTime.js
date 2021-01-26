import React from "react";

import "./clock.scss";

export default class FancyTime extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { number } = this.props;
    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
          transform: "scale(0.4)",
          width: 144,
          height: 144
        }}
      >
        <div id="wrap" ref={c => (this.wrap = c)} className={"wrap-" + number}>
          <div className="c" />
          <div className="o" />
          <div className="u" />
          <div className="n" />
          <div className="t" />
        </div>

        <svg>
          <defs>
            <filter id="filter">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="18"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10"
                result="filter"
              />
              <feComposite in="SourceGraphic" in2="filter" operator="atop" />
            </filter>
          </defs>
        </svg>
      </div>
    );
  }
}
