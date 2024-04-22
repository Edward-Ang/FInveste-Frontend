import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

function Screen() {
    const [searchInput, setSearchInput] = useState('');
    const [stocks, setStocks] = useState([]);
    const location = useLocation();
    const [watchlistId, setWatchlistId] = useState(null);

    useEffect(() => {
        const getScreen = async () => {
            try {
                if (location.state && location.state.watchlistId) {
                    setWatchlistId(location.state.watchlistId);
                    console.log(watchlistId);

                    const response = await axios.get('http://localhost:5000/api/get_screen', {
                        watchlistId
                    });
                    if(response.data){
                        const fetchedStocks = response.data;
                        setStocks(fetchedStocks);
                        console.log(stocks);
                    }else{
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

    return (
        <>
            <Header searchInput={searchInput} setSearchInput={setSearchInput} />
            {watchlistId && (
                <p>Received watchlistId: {watchlistId}</p>
                // Render other components or content based on watchlistId
            )}
            <div className="utility" id="screenUtility">
                <div className="utilityHeading">
                    <h3 id="watchlistName">Stock screener</h3>
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
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

}

export default Screen;
