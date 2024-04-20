import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/header.css';

const Header = ({ searchInput, setSearchInput }) => {
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowConfirmLogout(true); // Show the logout confirmation overlay
    };

    const handleCancelLogout = () => {
        setShowConfirmLogout(false); // Hide the logout confirmation overlay
    };

    const handleConfirmLogout = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/logout');

            if (response.data.message === 'Logged out') {
                // Redirect response from the server
                navigate('/login');
            } else {
                console.log('Unexpected response status:', response.message);
            }
        } catch (error) {
            console.log('Error logout: ', error);
        }
    };

    const handleNavigate = () =>{
        navigate('/watchlist');
    };

    return (
        <header>
            <div className="headerbar">
                <div className="headerLogo">
                    <img src="/images/6888.KL.svg" alt="logo" />
                    <a href="/home">FInvesté</a>
                </div>
                <div className="searchbar" onClick={(event) => event.stopPropagation()}>
                    <input type="text" autoComplete="off" id="filterInput" placeholder="Search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                </div>
                <div className="headerIcon" id="dropdownMenu">
                    <button id="dropdownButton"><i className="fa-solid fa-bars"></i></button>
                    <ul id="dropdownContent">
                        <li id="watchlistButtonLi">
                            <a id="watchlistButton" onClick={handleNavigate}>Watchlist</a>
                        </li>
                        <li>
                            <button id="accountButton" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
            {/* Logout confirmation overlay */}
            {showConfirmLogout && (
                <div className="confirmOverlay" id="logoutOverlay">
                    <div className="confirmPopup">
                        <div className="confirmWrapper">
                            <div className="confirmHeader">
                                <h5>Confirm to logout?</h5>
                            </div>
                            <div className="confirmBody">
                                <div className="confirmButtons">
                                    <button type="button" className="cancelButton" onClick={handleCancelLogout}>
                                        Cancel
                                    </button>
                                    <button type="button" className="confirmButton" onClick={handleConfirmLogout}>
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
