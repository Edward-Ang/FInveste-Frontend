import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/home.css';
import './css/main.css';
import './css/header.css';

function Home() {
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
            <div class="bodyWrapper">
                <div class="leftContainer">
                    <div class="card">
                        <div class="cardHead">
                            <h4>Malaysia stocks listed on Bursa</h4>
                        </div>
                        <div class="cardBody">
                            <p>
                                All data is sourced from Yahoo Finance, ensuring you have the
                                most accurate and up-to-date information.
                            </p>
                            <div class="cardButton">
                                <button id="moreButton">
                                    <a id="moreLink" target="_blank" rel="noopener noreferrer" href="https://sg.finance.yahoo.com">More&nbsp;<i
                                        class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="wthCard">
                        <div class="favHead">
                            <h3>Favourites</h3>
                            <span><i class="bi bi-bookmark-fill" id="bookmarkIcon"></i></span>
                        </div>
                        <div class="favBody">
                            <table id="favTable">
                                <tbody id="favBody">
                                    <tr>
                                        <th class="thFav">Stock</th>
                                        <th class="thFav">Rating</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="rightContainer">
                    <div class="utility">
                        <div class="utilityHeading">
                            <span id="watchlistName">Stock screener</span>
                            <span class="badge text-bg-info"  style={{ fontSize: 'small', margin: '3px 0px 0px 8px' }}>MY</span>
                        </div>
                        <div class="utilityBtn">
                            <button class="Button" id="saveButton">Save</button>
                            <button class="Button" id="filterButton">Filter</button>
                            <button title="Download" onclick="exportTableToCSV('stocks.csv')" id="downloadButton">
                                <i class="bi bi-download"></i>
                            </button>
                        </div>
                    </div>
                    <div class="tableview">
                        <table id="myTable">
                            <thead>
                                <tr class="theader">
                                    <th onclick=""></th>
                                    <th onclick="sortTable(1)">#</th>
                                    <th class="Ticker" onclick="sortTable(2)">
                                        <div class="ndcol">
                                            <div class="tickerword">Stock</div>
                                        </div>
                                    </th>
                                    <th onclick="sortTable(3)">Open</th>
                                    <th onclick="sortTable(4)">High</th>
                                    <th onclick="sortTable(5)">Low</th>
                                    <th onclick="sortTable(6)">Close</th>
                                    <th onclick="sortTable(7)">MA</th>
                                    <th onclick="sortTable(8)">EMA</th>
                                    <th onclick="sortTable(9)">RSI</th>
                                    <th onclick="sortTable(10)">Rating</th>
                                </tr>
                            </thead>
                            <tbody id="tableBody">

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
