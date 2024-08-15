import React, { useEffect, useState } from "react";
import './App.css';
import Login from "./components/base/Login";
import Home from "./components/base/Home";
import "./helpers/interceptor"
import LoginShopNow from "./components/base/LoginShopNow";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wantLogin, setWantLogin] = useState(false);

  const loggedIn = () => {
    let isLoggedIn = sessionStorage.getItem('token')
    if (isLoggedIn) {
      setIsAuthenticated(true);
    }
  }

  useEffect(() => {
    loggedIn();
  }, [])


  return (
    <React.Fragment>
      {!isAuthenticated ?
        (!wantLogin ?
          (<LoginShopNow setWantLogin={() => { setWantLogin(true) }}></LoginShopNow>) :
          (<Login setIsAuthenticated={() => { setIsAuthenticated(true) }} setWantLogin={() => { setWantLogin(false) }}></Login>)
        )
        : (
          <Home></Home>
        )}
    </React.Fragment>
  );
}

export default App;
