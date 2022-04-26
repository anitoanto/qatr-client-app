import "./App.css";
import pitchAnalyser from "pitch-analyser";
import { useRef, useState } from "react";
import { LineChart, Line, CartesianGrid, Tooltip, YAxis } from "recharts";
import db from "./services/firebaseConfig";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import Nav from "./Nav";

function App() {
  const N = 18;
  const [freq, setFreq] = useState(0);
  const [freqList, setFreqList] = useState([]);
  const [timeRem, setTimeRem] = useState(N);
  const [dataSubmitted, setDataSubmitted] = useState(false);

  const rollRef = useRef();
  const nameRef = useRef();
  const branchRef = useRef();
  const formRef = useRef();
  const analyser = new pitchAnalyser({
    callback: function (payload) {
      setFreq(payload.frequency);
      setFreqList((freqList) => [...freqList, { val: payload.frequency / 10 }]);
    },
  });

  const startListening = () => {
    analyser.initAnalyser().then(() => {
      analyser.startAnalyser();
      let interval = setInterval(() => {
        setTimeRem((timeRem) => timeRem - 1);
      }, 1000);
      setTimeout(() => {
        analyser.stopAnalyser();
        clearInterval(interval);
        decodeFreqList();
      }, N * 1000);
    });
  };

  const decodeFreqList = () => {
    let data;
    setFreqList((freqList) => {
      data = freqList;
      return freqList;
    });
    let decoded = [];
    data.forEach((e) => {
      if (e.val > 260) {
        if (e.val > 350 && e.val < 365) {
          if (decoded.slice(-1) != "H") decoded.push("H");
        }
        if (e.val > 265 && e.val < 285) {
          if (decoded.slice(-1) != "1") decoded.push("1");
        }
        if (e.val > 305 && e.val < 320) {
          if (decoded.slice(-1) != "0") decoded.push("0");
        }
        if (e.val > 390 && e.val < 540) {
          if (decoded.slice(-1) != "E") decoded.push("E");
        }
      }
    });

    let decodedString = decoded.join("");

    let count = 0;
    for (let i = 0; i < decodedString.length; i++) {
      if (decodedString[i] == "E") count++;
    }

    if (count > 1) {
      let split = decodedString.split("E");
      split.pop();
      let finalCodes = [];
      split.forEach((e) => {
        let newE = e.replace(/H/g, "");
        finalCodes.push(newE);
      });
      let validCodes = [];
      finalCodes.forEach((e) => {
        if (e.length == 4) {
          validCodes.push(e);
        }
      });
      console.log(validCodes);
      let identifiedCode = identifyCode(validCodes);
      alert(identifiedCode);
      console.log(identifiedCode);
      markPresent(identifiedCode);
    } else {
      alert("error in receiving data");
      console.log("error in receiving data");
    }
  };

  function identifyCode(validCodes) {
    let i = 0;
    let identifiedCode = "";
    let k = 0;
    for (k = 0; k < 4; k++) {
      let b1score = 0;
      let b0score = 0;
      for (i = 0; i < validCodes.length; i++) {
        if (validCodes[i][k] == 1) {
          b1score += 1;
        } else {
          b0score += 1;
        }
      }
      if (b1score > b0score) {
        identifiedCode += "1";
      } else {
        identifiedCode += "0";
      }
    }
    return identifiedCode;
  }

  async function markPresent(identifiedCode) {
    const docRef = doc(db, "session", "present_meeting_code");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      let realCode = docSnap.data().value;
      let sessionId = docSnap.data().id;
      console.log(realCode);
      if (realCode == identifiedCode) {
        let rollno = rollRef.current.value;
        let name = nameRef.current.value;
        let branch = branchRef.current.value;
        await setDoc(doc(db, sessionId, rollno), {
          roll: rollno,
          name: name,
          branch: branch,
        });
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  return (
    <div>
      <Nav />
      <div className="home_root">
        <h1>Client App</h1>
        <div ref={formRef}>
          <input type="text" placeholder="roll number" ref={rollRef} />
          <input type="text" placeholder="name" ref={nameRef} />
          <input type="text" placeholder="branch" ref={branchRef} />
          <br />
          <button
            onClick={() => {
              setDataSubmitted(true);
            }}
          >
            submit
          </button>
        </div>
        {dataSubmitted == true ? (
          <div>
            <div>
              <br />
              <div>{freq}</div>
              <button onClick={startListening}>start listening</button>
              <div>{timeRem}</div>
            </div>
            <div>
              <LineChart width={800} height={400} data={freqList}>
                <Line type="monotone" dataKey="val" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default App;
