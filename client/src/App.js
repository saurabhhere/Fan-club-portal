import './App.css';
import {Redirect, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import ChatList from './components/ChatList/ChatList';
import UserContext from './context/userContext';
import {useEffect, useState } from 'react';
import url from './misc/url';
import axios from 'axios';
import UserProfile from './components/UserProfile/UserProfile';
import Navbar from './components/Navbar/Navbar';
import AccountActivate from './components/AccountActivate/AccountActivate';
import Chatroom from './components/Chatroom/Chatroom';
import Modal from 'react-modal';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import ChatRoomAvailable from './components/ChatRoomAvailable/ChatRoomAvailable';
import ChatroomLeaderboard from './components/ChatroomLeaderboard/ChatroomLeaderboard';
import UserLeaderboard from './components/UserLeaderboard/UserLeaderboard';

Modal.setAppElement('#root')

function App() {

  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null){
        localStorage.setItem("auth-token", "");
        token="";
      }
      const tokenResponse = await axios.post(
        `${url.serverURL}/user/tokenIsValid`, null,
        {headers: {"x-auth-token": token}}
      )
      if (tokenResponse.data) {
        const userRes = await axios.get(`${url.serverURL}/user/`, {
          headers: {"x-auth-token": token},
        });
        setUserData({
          token, 
          user: userRes.data,
        });
      }
    }
    checkLoggedIn();
  }, []);

  toast.configure();

  return (
    <div className="app-container">
        <Router>
          <UserContext.Provider value={{ userData, setUserData }}>
            <Navbar />
            <div className="app">
              <Switch>
              <Route path="/" exact component={ChatList} />
              <Route path="/room/available" exact component={ChatRoomAvailable} />
              <Route path="/room/:roomId" exact component={Chatroom} />
              <Route path="/user/login" exact component={Login} />
              <Route path="/chatroom/leaderboard" exact component={ChatroomLeaderboard} />
              <Route path="/user/leaderboard" exact component={UserLeaderboard} />
              <Route path="/user/profile/:userId" exact component={UserProfile} />
              <Route path="/authentication/activate/:token" exact component={AccountActivate} />
              <Redirect to="/" />
            </Switch>
            </div>
          </UserContext.Provider>
        </Router>
      </div>
  );
}

export default App;
