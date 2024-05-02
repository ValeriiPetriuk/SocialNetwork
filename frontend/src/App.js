import React, {useRef, useEffect, useState} from "react";
import { BrowserRouter, Route,  Routes } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer';
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import HomeScreens from "./Screens/HomeScreens";
import PostScreens from "./Screens/PostScreens";
import LoginScreens from "./Screens/LoginScreens";
import RegisterScreens from "./Screens/RegisterScreens";
import MyListPostScreens from "./Screens/MyListPostScreens";
import CreatePostScreens from "./Screens/CreatePostScreens";
import UpdatePostScreens from "./Screens/UpdatePostScreens";
import UsersDetailsProfile from "./Screens/UsersDetailsProfile";
import ChatScreens from "./Screens/ChatScreens";
import NotificationScreens from "./Screens/NotificationScreens";
import {useSelector} from "react-redux";
import NavbarOffcanvas from "react-bootstrap/NavbarOffcanvas";
import NotificationAlert from "./components/NotificationAlert";



function App() {
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin
    const [notifications, setNotifications] = useState([])

    const ws = useRef(null);

    useEffect(() => {

      if (userInfo) {
           console.log("notifications:", notifications)
           ws.current = new WebSocket(`ws://localhost:8000/ws/notify/?token=${userInfo.token}`);
           ws.current.onopen = e => console.log('Chat socket opened');

           ws.current.onmessage = e => {
               const msg = JSON.parse(e.data)

                if (userInfo.username === msg.user) {
                    console.log("msg:", msg)
                    // setNotifications(prevNotifications => [...prevNotifications, msg]);
                    setNotifications(() => [msg])
                }


           }

            return () => {
                 if (ws.current) {
                   ws.current.close();
                 }
           };
      }


    }, [userInfo])



  return (

    <BrowserRouter>

        <Header/>
        {notifications.length > 0 && <NotificationAlert variant='info' notifications={notifications}/>}


        <main className="py-3">
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreens />} exact/>
              <Route path="/post/:id" element={<PostScreens />} />
              <Route path="/mylistpost" element={<MyListPostScreens />} />
              <Route path="/create-post" element={<CreatePostScreens />} />
              <Route path="/update-post/:id" element={<UpdatePostScreens />} />

              <Route path="/login" element={<LoginScreens />} />
              <Route path="/register" element={<RegisterScreens />} />
              <Route path="/profile" element={<UsersDetailsProfile />} />
              <Route path="/notification" element={<NotificationScreens />} />
              {/* <Route path="/chats" element={<ChatListScreens />} /> */}
              <Route  path="/chats/:chatUuid?" element={<ChatScreens/>} />
            </Routes>
          </Container>
        </main>
        <Footer/>
    
    </BrowserRouter>
  );
}

export default App;
