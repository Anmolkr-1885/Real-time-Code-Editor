import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useEffect } from "react";

const socket = io("https://real-time-code-editor-00mi.onrender.com");

const App = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// code goes here");
  const [users,setUsers]=useState([]);
  const [typing,setTyping]=useState("");
  const [output,setOutput]=useState(""); 
  const [version,setVersion]=useState("*");

  useEffect(()=>{
    socket.on("user-joined",(users)=>{
      setUsers(users);
    })

    socket.on("code-update",(newCode)=>{
      setCode(newCode);
    })

    socket.on("user-left",(users)=>{  
      setUsers(users);
    })

    socket.on("user-typing",(username)=>{
      setTyping(`${username.slice(0,8)} is typing...`);
      setTimeout(()=>{
        setTyping("");
      },2000)
    })

    socket.on("language-update",(language)=>{
      setLanguage(language);
    })

    socket.on("codeResponse",(response)=>{
      console.log(response);
      setOutput(response);
    })
     
    
    return()=>{
      socket.off("user-joined");
      socket.off("code-update");
      socket.off("user-typing");
      socket.off("language-update");
      socket.off("user-left");
      socket.off("codeResponse");
    }


  },[])


  useEffect(()=>{
    const handleBeforeUnload=(e)=>{
      socket.emit("leave-room");
    }
    window.addEventListener("beforeunload",handleBeforeUnload);
     
    return()=>{
      window.removeEventListener("beforeunload",handleBeforeUnload);
    }
  },[]);

  const joinRoom = () => {
    if (roomId && username) {
      socket.emit("join", { roomId, username });
      setJoined(true);
    }
  };

  const leaveRoom=()=>{
    socket.emit("leave-room");
    setJoined(false);
    setRoomId("");
    setUsername("");
    setCode("");
    setLanguage("javascript");
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID Copied to Clipboard");
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("code-change", { roomId, code: newCode });
    socket.emit("typing",{roomId,username});
  };

  const handleLanguageChange=(e)=>{
    setLanguage(e.target.value);
    socket.emit("language-change",{roomId,language:e.target.value});
  }


   const runCode = async () =>{
    socket.emit("compile-code",{roomId,language,code,version});
   }

  if (!joined) {
    return (
      <div className="join-container">
        <div className="join-form">
          <h1>JOIN THE ROOM</h1>
          <input
            type="text"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <input
            type="text"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button id="join-btn" onClick={joinRoom}>
            {" "}
            JOIN ROOM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-sidebar">
        <div className="room-info">
          <h2>ROOM ID : {roomId}</h2>

          <button onClick={copyRoomId}> COPY ROOM ID</button>
        </div>
        <h3>USERS IN ROOM</h3>
        <ul>
        {
          users.map((user,index)=>{
            return <li key={index}>{user.slice(0,10)}...</li>
          })
        }

          
        </ul>
        <p className="typing-indicator">{typing}</p>
        <select className="language-select" value={language} onChange={ handleLanguageChange}> 
          <option value="javascript">JAVASCRIPT</option>
          <option value="python">PYTHON</option>
          <option value="cpp">C++</option>
          <option value="java">JAVA</option>
          <option value="csharp">C#</option>
          <option value="ruby">RUBY</option>
          <option value="go">GO</option>
        </select>
        <button className="leave-btn" onClick= {leaveRoom}> LEAVE</button>
      </div>
      <div className="editor-main">
      <Editor
        height="60%"
        defaultLanguage="language"
        language={language}
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          fontSize: 16,
          minimap: { enabled: false },
         
        }}
      
       />
       <button className="run-btn" onClick={runCode}> RUN CODE </button>
      <textarea className="output-area" value={output} readOnly placeholder="Output will be displayed here..."></textarea>

      </div>
      
    </div>
  );
};

export default App;
