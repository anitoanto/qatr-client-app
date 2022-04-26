import { useState, useEffect } from "react";
import db from "./services/firebaseConfig";
import { collection, addDoc, setDoc, doc, getDocs } from "firebase/firestore";
import { async } from "@firebase/util";
import "./App.css";
import Nav from "./Nav";

function Host() {
  const [code, setCode] = useState("");
  const [students, setStudents] = useState([]);
  const [id, setId] = useState("");
  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function getRandomCode() {
    let possibleSymbols = "10";
    let randomCode = "";
    for (let i = 0; i < 4; i++) {
      randomCode += possibleSymbols[Math.round(Math.random())];
    }
    return randomCode;
  }

  //   useEffect(() => {
  //     setCode(getRandomCode());
  //   }, []);

  const onNewClick = async () => {
    let code = getRandomCode();
    setCode(code);
    let idVal = makeid(12);
    setId(idVal);

    try {
      //   const docRef = await addDoc(collection(db, "session"), {
      //     present_meeting_code: code,
      //   });
      //   console.log("Document written with ID: ", docRef.id);

      //   db.collection("session").doc("present_meeting_code").set({
      //     value: code,
      //   });

      await setDoc(doc(db, "session", "present_meeting_code"), {
        value: code,
        id: idVal,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  async function handleSeeSt() {
    console.log(id);
    let sts = [];
    const querySnapshot = await getDocs(collection(db, id));
    await querySnapshot.forEach((doc) => {
      console.log(doc.data());
      sts.push(doc.data());
    });
    setStudents(sts);
    console.log(sts);
  }
  return (
    <div>
      <Nav />
      <div className="home_root">
        <h1>Host Dashboard</h1>
        <div>
          <h2>Make a new code and type the code on hardware device</h2>
          <h2>{code}</h2>
          <button onClick={onNewClick}>get new code</button>
        </div>
        <br />
        <br />
        <div>
          <h2>After buzzer operations, see the report</h2>
          <button onClick={handleSeeSt}>see student attendence report</button>
          <br />
          <br />
          <h4>Total attendees: {students.length}</h4>
          <div>
            <table>
              <tr>
                <td>Roll number</td>
                <td>Name</td>
                <td>Branch</td>
              </tr>
              {students.map((e, index) => {
                return (
                  <tr key={index}>
                    <td>{e.roll}</td>
                    <td>{e.name}</td>
                    <td>{e.branch}</td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Host;
