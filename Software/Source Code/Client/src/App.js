import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Profile from "./Profile";
import Register from "./Register";
import VerifyEmail from "./VerifyEmail";
import Login from "./Login";
import { AuthProvider } from "./AuthContext";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import PrivateRoute from "./PrivateRoute";
import Welcome from "./Welcome";
import Record from "./Record";
// import Upload from "./Upload";
import Home from "./Home";
import Upload from "./Modal";
import Modal2 from "./Modal2";
import Test from "./Test";
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [timeActive, setTimeActive] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);
  return (
    <Router>
      <AuthProvider value={{ currentUser, timeActive, setTimeActive }}>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <Route exact path="/record" component={Modal2} />
          <Route exact path="/upload" component={Upload} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/verify-email" component={VerifyEmail} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
