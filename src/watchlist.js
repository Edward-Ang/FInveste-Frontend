import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/header.css';

function Watchlist() {
    const navigate = useNavigate();
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);

    const handleLogout = () => {
        setShowConfirmLogout(true); // Show the logout confirmation overlay
    };

    const handleCancelLogout = () => {
        setShowConfirmLogout(false); // Hide the logout confirmation overlay
    };

    const handleConfirmLogout = () => {
        // Perform logout logic here, e.g., redirect to '/logout'
        navigate('/login');
    };

    return (
        <>
            <header>
                <div className="headerbar">
                    <div className="headerLogo">
                        <img src="/6888.KL.svg" alt="logo" />
                        <a href="/home">FInvesté</a>
                    </div>
                    <div className="searchbar" onClick={(event) => event.stopPropagation()}>
                        <input type="text" autoComplete="off" id="filterInput" placeholder="Search" />
                    </div>
                    <div className="headerIcon" id="dropdownMenu">
                        <button id="dropdownButton"><i className="fa-solid fa-bars"></i></button>
                        <ul id="dropdownContent">
                            <li id="watchlistButtonLi">
                                <a id="watchlistButton" href="/watchlist">Watchlist</a>
                            </li>
                            <li>
                                <button id="accountButton" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
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
        </>
    );
}

export default Watchlist;