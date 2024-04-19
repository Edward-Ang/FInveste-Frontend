import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/home.css';
import './css/main.css';
import './css/header.css';
import Header from './Header';

function Home() {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const getTable = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/get_main');
                const fetchedStocks = response.data;
                setStocks(fetchedStocks);
            } catch (error) {
                console.error('Error fetching stocks:', error);
            }
        };

        getTable();
    }, []); // The empty array means this effect runs once after the initial render

    return (
        <>
        <Header />
            <div className="bodyWrapper">
                <div className="leftContainer">
                    <div className="card">
                        <div className="cardHead">
                            <h4>Malaysia stocks listed on Bursa</h4>
                        </div>
                        <div className="cardBody">
                            <p>
                                All data is sourced from Yahoo Finance, ensuring you have the
                                most accurate and up-to-date information.
                            </p>
                            <div className="cardButton">
                                <a href="https://sg.finance.yahoo.com" target="_blank" rel="noopener noreferrer">
                                    <button id="moreButton">More&nbsp;<i className="fa-solid fa-arrow-up-right-from-square"></i></button>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="wthCard">
                        <div className="favHead">
                            <h3>Favourites</h3>
                            <span><i className="bi bi-bookmark-fill" id="bookmarkIcon"></i></span>
                        </div>
                        <div className="favBody">
                            <table id="favTable">
                                <tbody id="favBody">
                                    <tr>
                                        <th className="thFav">Stock</th>
                                        <th className="thFav">Rating</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="rightContainer">
                    <div className="utility">
                        <div className="utilityHeading">
                            <span id="watchlistName">Stock screener</span>
                            <span className="badge text-bg-info" style={{ fontSize: 'small', margin: '3px 0px 0px 8px' }}>MY</span>
                        </div>
                        <div className="utilityBtn">
                            <button className="Button" id="saveButton">Save</button>
                            <button className="Button" id="filterButton">Filter</button>
                            <button title="Download" onClick={() => { }} id="downloadButton">
                                <i className="bi bi-download"></i>
                            </button>
                        </div>
                    </div>
                    <div className="tableview">
                        <table id="myTable">
                            <thead>
                                <tr className="theader">
                                    <th onClick={() => { }}> </th>
                                    <th onClick={() => { }}>#</th>
                                    <th className="Ticker" onClick={() => { }}>
                                        <div className="ndcol">
                                            <div className="tickerword">Stock</div>
                                        </div>
                                    </th>
                                    <th onClick={() => { }}>Open</th>
                                    <th onClick={() => { }}>High</th>
                                    <th onClick={() => { }}>Low</th>
                                    <th onClick={() => { }}>Close</th>
                                    <th onClick={() => { }}>MA</th>
                                    <th onClick={() => { }}>EMA</th>
                                    <th onClick={() => { }}>RSI</th>
                                    <th onClick={() => { }}>Rating</th>
                                </tr>
                            </thead>
                            <tbody id="tableBody">
                                {stocks.map((stock, index) => (
                                    <tr key={index}>
                                        <td className="saveFav">
                                            <span
                                                className="favSpan"
                                                data-value={stock.Stock}
                                                onClick={() => { }}
                                            >
                                                <i className={stock.Book === 0 ? "bi bi-bookmark" : "bi bi-bookmark-fill"} />
                                            </span>
                                        </td>
                                        <td>{index + 1}</td>
                                        <td key={index} className='stockCol'>
                                            <div className="stockContainer">
                                                <div className="stockLogo">
                                                    <img src={`/images/${stock.Stock}.svg`} alt={stock.Stock} />
                                                </div>
                                                <div className="stockWrapper">
                                                    <span className="stockTicker">{stock.Stock}</span>
                                                    <span className="stockName">{stock.Name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{stock.Open}</td>
                                        <td>{stock.High}</td>
                                        <td>{stock.Low}</td>
                                        <td>{stock.Close}</td>
                                        <td>{stock.MA}</td>
                                        <td>{stock.EMA}</td>
                                        <td>{stock.RSI}</td>
                                        <td className={getRatingClass(stock.Rating)}>{stock.Rating}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

function getRatingClass(rating) {
    switch (rating) {
        case "Strong Buy":
            return "sb";
        case "Buy":
            return "b";
        case "Neutral":
            return "n";
        case "Sell":
            return "s";
        case "Strong Sell":
            return "ss";
        default:
            return "";
    }
}

export default Home;
