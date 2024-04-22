import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

function Screen() {
    const [searchInput, setSearchInput] = useState('');
    const [stocks, setStocks] = useState([]);
    const [watchlistName, setWatchlistName] = useState('');
    const location = useLocation();

    useEffect(() => {
        const getScreen = async () => {
            try {
                if (location.state && location.state.watchlistId) {
                    setWatchlistName(location.state.watchlistName);
                    const watchlistID = location.state.watchlistId;
                    const response = await axios.post('http://localhost:5000/api/get_screen', {
                        watchlistID
                    });
                    if (response.data) {
                        const fetchedStocks = response.data;
                        setStocks(fetchedStocks);
                        console.log('frontend', stocks);
                    } else {
                        console.log('No stocks get');
                    }
                } else {
                    // (e.g., redirect to a default page or show an error message)
                    console.error('watchlistId not found in location state');
                }
            } catch (error) {
                console.error('Error fetching stocks:', error);
            }
        };

        getScreen();
    }, [location.state]);

    const filteredStocks = stocks.filter(stock =>
        stock.Stock.toLowerCase().includes(searchInput.toLowerCase()) ||
        stock.Name.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <>
            <Header searchInput={searchInput} setSearchInput={setSearchInput} />
            <div className="utility" id="screenUtility">
                <div className="utilityHeading">
                    <h3 id="watchlistName">{watchlistName}</h3>
                </div>
            </div>
            <div className="body">
                <div className="spinnerBg" id="spinnerBg">
                    <div id="spinner" className="spinner">
                    </div>
                </div>
                <div className="tableview" id="screenTableView">
                    <table id="myTable">
                        <thead>
                            <tr className="theader">
                                <th onclick="sortTable(0)">#</th>
                                <th className="Ticker" onclick="sortTable(1)">
                                    <div className="ndcol" >
                                        <div className="tickerword">
                                            Stock
                                        </div>
                                    </div>
                                </th>
                                <th onclick="sortTable(2)">Open</th>
                                <th onclick="sortTable(3)">High</th>
                                <th onclick="sortTable(4)">Low</th>
                                <th onclick="sortTable(5)">Close</th>
                                <th onclick="sortTable(6)">MA</th>
                                <th onclick="sortTable(7)">EMA</th>
                                <th onclick="sortTable(8)">RSI</th>
                                <th onclick="sortTable(9)">Rating</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            {filteredStocks.map((stock, index) => (
                                <tr key={index}>
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

export default Screen;
