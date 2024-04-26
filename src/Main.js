import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Your home page component
import Login from './Login';
import Signup from './Signup';
import Watchlist from './watchlist';
import Screen from './Screen';
import Reset from './Reset';

function Main() {
 return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/screen" element={<Screen />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </Router>
 );
}

export default Main;
