import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
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
    const [openValue, setOpenValue] = React.useState([0, 600]);
    const [highValue, setHighValue] = React.useState([0, 600]);
    const [lowValue, setLowValue] = React.useState([0, 600]);
    const [closeValue, setCloseValue] = React.useState([0, 600]);
    const [MAValue, setMAValue] = React.useState([0, 600]);
    const [EMAValue, setEMAValue] = React.useState([0, 600]);
    const [RSIValue, setRSIValue] = React.useState([0, 600]);
    const [ratingValue, setRatingValue] = useState('All');
    const defaultRange = [0, 600];

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
        (stock.Stock.toLowerCase().includes(searchInput.toLowerCase()) ||
            stock.Name.toLowerCase().includes(searchInput.toLowerCase())) &&
        (stock.Open >= openValue[0] && stock.Open <= openValue[1]) &&
        (stock.High >= highValue[0] && stock.High <= highValue[1]) &&
        (stock.Low >= lowValue[0] && stock.Low <= lowValue[1]) &&
        (stock.Close >= closeValue[0] && stock.Close <= closeValue[1]) &&
        (stock.MA >= MAValue[0] && stock.MA <= MAValue[1]) &&
        (stock.EMA >= EMAValue[0] && stock.EMA <= EMAValue[1]) &&
        (stock.RSI >= RSIValue[0] && stock.RSI <= RSIValue[1]) &&
        (ratingValue === 'All' || 
        (ratingValue === 'Buy' && stock.Rating === 'Buy') ||
        (ratingValue === 'Sell' && stock.Rating === 'Sell') ||
        (ratingValue === 'Strong Buy' && stock.Rating === 'Strong Buy') ||
        (ratingValue === 'Strong Sell' && stock.Rating === 'Strong Sell') ||
        (ratingValue === 'Neutral' && stock.Rating === 'Neutral'))
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

    const handleBookmark = async (stock) => {
        try {
            const response = await axios.post('http://localhost:5000/api/toggleBookmark', {
                stock,
            });

            if (response.data.message === 'Toggle success') {
                setTriggerEffect(true);
            } else {
                console.log('toggle failed');
            }
        } catch (error) {
            console.log('Error toggle: ', error);
        }
    }

    const handleOpenChange = (event, newValue) => {
        setOpenValue(newValue);
    };

    const handleHighChange = (event, newValue) => {
        setHighValue(newValue);
    };

    const handleLowChange = (event, newValue) => {
        setLowValue(newValue);
    };

    const handleCloseChange = (event, newValue) => {
        setCloseValue(newValue);
    };

    const handleMAChange = (event, newValue) => {
        setMAValue(newValue);
    };

    const handleEMAChange = (event, newValue) => {
        setEMAValue(newValue);
    };

    const handleRSIChange = (event, newValue) => {
        setRSIValue(newValue);
    };

    const handleRatingChange = (event) => {
        setRatingValue(event.target.value);
    }

    const handleReset = () => {
        setOpenValue(defaultRange);
        setHighValue(defaultRange);
        setLowValue(defaultRange);
        setCloseValue(defaultRange);
        setMAValue(defaultRange);
        setEMAValue(defaultRange);
        setRSIValue(defaultRange);
        setRatingValue('All');
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
                                <button id="clearButton" onClick={handleReset}>
                                    Reset all&nbsp;<i className="fa-solid fa-arrow-rotate-right"></i>
                                </button>
                            </div>
                            <table id="filterTable">
                                <tr className="filterRow">
                                    <td className="criteriaCol">Open</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <span className='filterValSpan'>{openValue[0]}</span>
                                            <Box sx={{ width: 200 }}>
                                                <Slider
                                                    getAriaLabel={() => 'Open range'}
                                                    value={openValue}
                                                    onChange={handleOpenChange}
                                                    valueLabelDisplay="auto"
                                                    min={0}
                                                    max={600}
                                                />
                                            </Box>
                                            <span className='filterValSpan'>{openValue[1]}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">High</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <span className='filterValSpan'>{highValue[0]}</span>
                                            <Box sx={{ width: 200 }}>
                                                <Slider
                                                    getAriaLabel={() => 'High range'}
                                                    value={highValue}
                                                    onChange={handleHighChange}
                                                    valueLabelDisplay="auto"
                                                    min={0}
                                                    max={600}
                                                    color='secondary'
                                                />
                                            </Box>
                                            <span className='filterValSpan'>{highValue[1]}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">Low</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <span className='filterValSpan'>{lowValue[0]}</span>
                                            <Box sx={{ width: 200 }}>
                                                <Slider
                                                    getAriaLabel={() => 'Low range'}
                                                    value={lowValue}
                                                    onChange={handleLowChange}
                                                    valueLabelDisplay="auto"
                                                    min={0}
                                                    max={600}
                                                />
                                            </Box>
                                            <span className='filterValSpan'>{lowValue[1]}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">Close</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <span className='filterValSpan'>{closeValue[0]}</span>
                                            <Box sx={{ width: 200 }}>
                                                <Slider
                                                    getAriaLabel={() => 'Close range'}
                                                    value={closeValue}
                                                    onChange={handleCloseChange}
                                                    valueLabelDisplay="auto"
                                                    min={0}
                                                    max={600}
                                                    color='secondary'
                                                />
                                            </Box>
                                            <span className='filterValSpan'>{closeValue[1]}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">MA</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <span className='filterValSpan'>{MAValue[0]}</span>
                                            <Box sx={{ width: 200 }}>
                                                <Slider
                                                    getAriaLabel={() => 'MA range'}
                                                    value={MAValue}
                                                    onChange={handleMAChange}
                                                    valueLabelDisplay="auto"
                                                    min={0}
                                                    max={600}
                                                />
                                            </Box>
                                            <span className='filterValSpan'>{MAValue[1]}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">EMA</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <span className='filterValSpan'>{EMAValue[0]}</span>
                                            <Box sx={{ width: 200 }}>
                                                <Slider
                                                    getAriaLabel={() => 'EMA range'}
                                                    value={EMAValue}
                                                    onChange={handleEMAChange}
                                                    valueLabelDisplay="auto"
                                                    min={0}
                                                    max={600}
                                                    color='secondary'
                                                />
                                            </Box>
                                            <span className='filterValSpan'>{EMAValue[1]}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">RSI</td>
                                    <td className="filterCol">
                                        <div className="sliderContainer">
                                            <span className='filterValSpan'>{RSIValue[0]}</span>
                                            <Box sx={{ width: 200 }}>
                                                <Slider
                                                    getAriaLabel={() => 'RSI range'}
                                                    value={RSIValue}
                                                    onChange={handleRSIChange}
                                                    valueLabelDisplay="auto"
                                                    min={0}
                                                    max={600}
                                                />
                                            </Box>
                                            <span className='filterValSpan'>{RSIValue[1]}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="filterRow">
                                    <td className="criteriaCol">Rating</td>
                                    <td className="filterCol">
                                        <select name="ratings" id="ratingOpt" value={ratingValue} onChange={handleRatingChange}>
                                            <option value="All">All</option>
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
                                            <td className="favStock">{stock.Stock}</td>
                                            <td className={getRatingClass(stock.Rating)}><i className={getRatingIcon(stock.Rating)} style={{ fontSize: '20px' }}></i></td>
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
                                                onClick={() => { handleBookmark(stock.Stock) }}
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

function getRatingIcon(rating) {
    switch (rating) {
        case "Strong Buy":
            return 'fa-solid fa-angles-up';
        case "Buy":
            return 'fa-solid fa-angle-up';
        case "Neutral":
            return 'fa-solid fa-minus';
        case "Sell":
            return 'fa-solid fa-angle-down';
        case "Strong Sell":
            return 'fa-solid fa-angles-down';
        default:
            return '';
    }
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
