import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import DownloadCSVButton from './Download';

function Screen() {
    const [searchInput, setSearchInput] = useState('');
    const [stocks, setStocks] = useState([]);
    const [watchlistName, setWatchlistName] = useState('');
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const getScreen = async () => {
            try {
                if (location.state && location.state.watchlistId) {
                    setWatchlistName(location.state.watchlistName);
                    const watchlistID = location.state.watchlistId;
                    const response = await axios.post('http://54.179.119.22:5000/api/get_screen', {
                        watchlistID
                    });
                    if (response.data) {
                        const fetchedStocks = response.data;
                        setStocks(fetchedStocks);
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

    const handleSort = (column) => {
        setSortedColumn(column);
        if (sortedColumn === column) {
            // If the same column is clicked, toggle the sort order
            setSortOrder(!sortOrder);
        } else {
            // If a different column is clicked, sort by that column in ascending order
            setSortedColumn(column);
            setSortOrder(true);
        }
    }

    const sortedStocks = sortedColumn
        ? [...filteredStocks].sort((a, b) => {
            const aValue = a[sortedColumn];
            const bValue = b[sortedColumn];
            if (aValue < bValue) return sortOrder ? -1 : 1;
            if (aValue > bValue) return sortOrder ? 1 : -1;
            return 0;
        })
        : filteredStocks;

    return (
        <>
            <Header searchInput={searchInput} setSearchInput={setSearchInput} />
            <div className='screen-body' id='screen-body'>
                <div className="utility" id="screenUtility">
                    <div className="utilityHeading">
                        <h3 className='watchlistName' id="watchlistName">{watchlistName}</h3>
                    </div>
                    <DownloadCSVButton data={sortedStocks} />
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
                                    <th>#</th>
                                    <th className="Ticker" onClick={() => { handleSort('Name') }}>
                                        <div className="ndcol" >
                                            <div className="tickerword">
                                                Stock
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={() => { handleSort('Open') }}>Open</th>
                                    <th onClick={() => { handleSort('High') }}>High</th>
                                    <th onClick={() => { handleSort('Low') }}>Low</th>
                                    <th onClick={() => { handleSort('Close') }}>Close</th>
                                    <th onClick={() => { handleSort('MA') }}>MA</th>
                                    <th onClick={() => { handleSort('EMA') }}>EMA</th>
                                    <th onClick={() => { handleSort('RSI') }}>RSI</th>
                                    <th onClick={() => { handleSort('RatingNo') }}>Rating</th>
                                </tr>
                            </thead>
                            <tbody id="tableBody">
                                {sortedStocks.map((stock, index) => (
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
