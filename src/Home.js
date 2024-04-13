import React from 'react';
//import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import './css/home.css';

function Home() {


    return (
        <header>
            <div className="headerbar">
                <div className="headerLogo">
                    <img src="/6888.KL.svg" alt="logo" />
                    <a href="/home">FInvesté</a>
                </div>
                <div className="searchbar" onclick="disableClick(event)">
                    <input type="text" autocomplete="off" id="filterInput" placeholder="Search" />
                </div>
                <div className="headerIcon" id="dropdownMenu">
                    <button id="dropdownButton"><i className="fa-solid fa-bars"></i></button>
                    <ul id="dropdownContent">
                        <li id="watchlistButtonLi">
                            <a id="watchlistButton" href="/watchlist">Watchlist</a>
                        </li>
                        <li><button id="accountButton">Login</button></li>
                    </ul>
                </div>
            </div>
        </header>
    );
}

export default Home;
