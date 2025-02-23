import React from 'react';
import './App.css';
import {Route,Routes} from 'react-router-dom';
import  {UserContextProvider} from './components/context/UserContext';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './components/Home';
// import PostNotes from './components/PostNotes';
// import GetNotes from './components/GetNotes';
import PostNotes from './components/PostNotes';
import GetNotes from './components/GetNotes';
function App() {
  return (
    <UserContextProvider>
    <Routes>
    <Route exact path='/' element={<Login/>} />
    <Route exact path="/register" element={<Register/>} />
    <Route exact path="/home" element={<Home/>} />
    <Route exact path="/postnotes" element={<PostNotes/>} />
    <Route exact path="/getnotes" element={<GetNotes/>} />
    </Routes>
  </UserContextProvider>
  );
}

export default App;
