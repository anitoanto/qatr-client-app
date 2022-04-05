import "./App.css";

import pitchAnalyser from "pitch-analyser";
import { useEffect, useState } from "react";

function App() {
  const [pitch, setPitch] = useState(0);
  const [pitchList, setPitchList] = useState([]);

  let freqList = [];

  const analyser = new pitchAnalyser({
    callback: function (payload) {
      let freq = payload.frequency;
      setPitch(freq);
      setPitchList((pitchList) => [...pitchList, freq]);
      freqList.push(freq);
    },
  });

  function decodePitchList() {
    // pitchList contained raw sampled data of 3 levels, 3500, 2700, 3100.
    // convert pitchList into levels avoiding noise values in between.
    let levels = [];
    let prev = 0;
    for (let i = 0; i < freqList.length; i++) {
      let curr = freqList[i];
      if (curr !== prev) {
        levels.push(curr);
        prev = curr;
      }
    }
    return levels;
  }

  const handleClick = () => {
    analyser.initAnalyser().then(() => {
      analyser.startAnalyser();
      setTimeout(() => {
        console.log("stop");
        // analyser.stopAnalyser();
        handleStopClick();
        console.log(decodePitchList());
      }, 4000);
    });
  };

  const handleStopClick = () => {
    analyser.initAnalyser().then(() => {
      analyser.stopAnalyser();
      setPitch(0);
    });
  };

  return (
    <div className="container">
      <h1>Quick Audience Turnout Recorder - Group 11</h1>
      <div className="pitch">{pitch}</div>
      <div className="btns">
        <button onClick={handleClick} className="start">Start</button>
        <button onClick={handleStopClick} className="stop">Reset</button>
      </div>
      <div>{pitchList.toString()}</div>
    </div>
  );
}

export default App;
