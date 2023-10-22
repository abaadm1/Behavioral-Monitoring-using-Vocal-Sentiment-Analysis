import { useState } from "react";
import { Link } from "react-router-dom";
import "./forms.css";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";
import { useHistory } from "react-router-dom";
import { useAuthValue } from "./AuthContext";

import home from "./assets/home.png";
function Login() {
  const [email, setEmail] = useState("jone33david@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const { setTimeActive } = useAuthValue();
  const history = useHistory();

  const login = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        localStorage.setItem("email", email);
        if (!auth.currentUser.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              setTimeActive(true);
              history.push("/verify-email");
            })
            .catch((err) => alert(err.message));
        } else {
          history.push("/profile");
          localStorage.setItem("verified", true);
        }
      })
      .catch((err) => setError(err.message));
  };
  return (
    <div className="center">
      <div className="auth">
        <Link to="/">
          <img alt="homepage" src={home} width="50px" />
        </Link>
        <h1>Log in</h1>
        {error && <div className="auth__error">{error}</div>}
        <form onSubmit={login} name="login_form">
          <input
            type="email"
            value={email}
            required
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            value={password}
            required
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
        <p>
          Don't have and account ? <Link to="/register"> Create one here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
