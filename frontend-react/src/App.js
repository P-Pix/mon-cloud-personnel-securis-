import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const register = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/register", { username, password });
      setMessage(res.data.message);
    } catch (e) {
      setMessage(e.response?.data?.error || "Erreur");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/login", { username, password });
      setMessage(res.data.message);
    } catch (e) {
      setMessage(e.response?.data?.error || "Erreur");
    }
  };

  return (
    <div>
      <h2>Login / Register</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      <p>{message}</p>
    </div>
  );
}
