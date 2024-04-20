import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './css/home.css';
import './css/main.css';
import './css/save.css';
import './css/filter.css';
import Header from './Header';

function Home() {
    const [stocks, setStocks] = useState([]);
    const [showSaveOverlay, setShowSaveOverlay] = useState(false);
    const [showFilterOverlay, setShowFilterOverlay] = useState(false);
    const [triggerEffect, setTriggerEffect] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [saveName, setSaveName] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const getTable = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/get_main', { withCredentials: true });
                const fetchedStocks = response.data;
                setStocks(fetchedStocks);
            } catch (error) {
                console.error('Error fetching stocks:', error);
            }
        };

        getTable();

        if (triggerEffect) {
            getTable(); // Trigger the effect if triggerEffect is true
            setTriggerEffect(false); // Reset triggerEffect to false after triggering
        }
    }, [navigate, triggerEffect]);

    const filteredStocks = stocks.filter(stock =>
        stock.Stock.toLowerCase().includes(searchInput.toLowerCase()) ||
        stock.Name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const filteredStocksBook = stocks.filter(stock => stock.Book === 1);

    const handleFilter = () => {
        setShowFilterOverlay(true);
    }

    const handleSave = () => {
        setShowSaveOverlay(true);
    }

    const handleCancelOverlay = () => {
        setShowSaveOverlay(false);
        setShowFilterOverlay(false);
        setSaveName('');
    }

    const handleSaveWatchlist = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/api/getUserId');
            const userId = response.data.userId;

            if (userId) {
                console.log(response.data.userId);
                try {
                    const response = await axios.post('http://localhost:5000/api/save_watchlist', {
                        saveName,
                        userId,
                        filteredStocks,
                    });
                    console.log(response.data.message);
                    if (response.data.message === 'Watchlist inserted successfully') {
                        setShowSaveOverlay(false);
                        setSaveName('');
                        toast.success('Watchlist saved successfully !', {
                            position: 'bottom-left'
                        });
                    } else {
                        toast.error('Watchlist name exist !', {
                            position: 'bottom-left'
                        });
                    }
                } catch (error) {
                    console.log('Error save watchlist: ', error);
                }
            } else {
                console.log('userId not exist.');
            }

        } catch (error) {
            console.log('Error get userId: ', error);
        }
    }

    const handleBookmark = (stock) => {
        toast.success(stock, {
            position: 'bottom-left'
        });
        try{
            const response = axios.post('http://localhost:5000/api/toggleBookmark', {
                stock,
            });
            
        }catch(error){

        }
    }

    return (
        <>
            <Header searchInput={searchInput} setSearchInput={setSearchInput} />
            <ToastContainer />
            {showSaveOverlay && (
                <div className="saveOverlay" id="saveOverlay">
                    <div className="savePopup">
                        <div className="saveHeader">
                            <h4>Save as watchlist</h4>
                            <button id="saveCloseButton" onClick={handleCancelOverlay}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="saveBody">
                            <form id="saveForm">
                                <div className="saveWrapper">
                                    <div className="savePrompt">
                                        <h6>Enter the screen name:</h6>
                                        <input type="text" autoComplete="off" id="saveInput" name="collection_name" value={saveName} onChange={(e) => setSaveName(e.target.value)} required />
                                        <h6 id="saveMsg">
                                            <span id="saveIcon"></span>&nbsp;<span id="saveAlert"></span>
                                        </h6>
                                    </div>
                                    <div className="saveButtons">
                                        <button type="button" className="cancelButton" id="cancelButton" onClick={handleCancelOverlay}>
                                            Cancel
                                        </button>
                                        <input type="submit" className="confirmButton" value="Save" id="saveButton2" onClick={handleSaveWatchlist} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showFilterOverlay && (
                <div className="filterOverlay" id="filterOverlay">
                    <div className="filterPopup">
                        <div className="filterHeader">
                            <h4>Filter</h4>
                            <button id="filterCloseButton"><i className="bi bi-x-lg" onClick={handleCancelOverlay}></i></button>
                        </div>
                        <div className="filterBody">
                            <div className="resetDiv">
                                <button id="clearButton">
                                    Reset all&nbsp;<i className="fa-solid fa-arrow-rotate-right"></i>
                                </button>
                            </div>
                            <table id="filterTable">
                                <tr className="filterRow">
                                    <td className="criteriaCol">Open</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <div><span id="kt_slider_basic_min_open"></span></div>
                                            <div className="rangeOdd" id="kt_slider_basic_open"></div>
                                            <div><span id="kt_slider_basic_max_open"></span></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">High</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <div><span id="kt_slider_basic_min_high"></span></div>
                                            <div className="rangeEven" id="kt_slider_basic_high"></div>
                                            <div><span id="kt_slider_basic_max_high"></span></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">Low</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <div><span id="kt_slider_basic_min_low"></span></div>
                                            <div className="rangeOdd" id="kt_slider_basic_low"></div>
                                            <div><span id="kt_slider_basic_max_low"></span></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">Close</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <div><span id="kt_slider_basic_min_close"></span></div>
                                            <div className="rangeEven" id="kt_slider_basic_close"></div>
                                            <div><span id="kt_slider_basic_max_close"></span></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">MA</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <div><span id="kt_slider_basic_min_MA"></span></div>
                                            <div className="rangeOdd" id="kt_slider_basic_MA"></div>
                                            <div><span id="kt_slider_basic_max_MA"></span></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">EMA</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <div><span id="kt_slider_basic_min_EMA"></span></div>
                                            <div className="rangeEven" id="kt_slider_basic_EMA"></div>
                                            <div><span id="kt_slider_basic_max_EMA"></span></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">RSI</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <div><span id="kt_slider_basic_min_RSI"></span></div>
                                            <div className="rangeOdd" id="kt_slider_basic_RSI"></div>
                                            <div><span id="kt_slider_basic_max_RSI"></span></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">Rating</td>
                                    <td className="filterCol">
                                        <select name="ratings" id="ratingOpt">
                                            <option value="All" selected>All</option>
                                            <option value="Strong Buy">Strong Buy</option>
                                            <option value="Buy">Buy</option>
                                            <option value="Neutral">Neutral</option>
                                            <option value="Sell">Sell</option>
                                            <option value="Strong Sell">Strong Sell</option>
                                        </select>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            )}
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
                                    {filteredStocksBook.map((stock, index) => (
                                        <tr key={index}>
                                            <td className="thFav">{stock.Stock}</td>
                                            <td className="thFav">{stock.Rating}</td>
                                        </tr>
                                    ))}
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
                            <button className="Button" id="saveButton" onClick={handleSave}>Save</button>
                            <button className="Button" id="filterButton" onClick={handleFilter}>Filter</button>
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
                                {filteredStocks.map((stock, index) => (
                                    <tr key={index}>
                                        <td className="saveFav">
                                            <span
                                                className="favSpan"
                                                data-value={stock.Stock}
                                                onClick={() => {handleBookmark(stock.Stock)}}
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
