import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/header.css';
import './css/watchlist.css';
import Header from './Header';

function Watchlist() {
    const [searchInput, setSearchInput] = useState('');
    const [watchlists, setWatchlists] = useState([]);

    useEffect(() => {
        const getWatchlist = async () => {
            try{
                const response = await axios.get('http://localhost:5000/api/get_watchlist');
                const fetchedWatchlists = response.data;
                setWatchlists(fetchedWatchlists);
            }catch(error){
                console.log('Error get watclist: ', error);
            }
        }

        getWatchlist();

    }, []);

    const filteredWatchlists = watchlists.filter(watchlists =>
        watchlists.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        watchlists.date.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <>
            <Header searchInput={searchInput} setSearchInput={setSearchInput} />
            <div id="watchlistWrapper">
                <div class="utility" id="watchlistUtility">
                    <h3 id="watchlistName">My watchlist</h3>
                </div>
                <div class="tableview" id="wlTableView">
                    <table id="wltable">
                        <thead id="wlhead">
                            <tr>
                                <th id="noColumn" onclick="sortTable(0)">#</th>
                                <th id="watchlistColumn" onclick="sortTable(1)">Watchlist</th>
                                <th id="datecColumn">Date Created</th>
                                <th id="timecColumn">Time Created</th>
                                <th id="dltColumn"></th>
                            </tr>
                        </thead>
                        <tbody id="wlbody">
                            {filteredWatchlists.map((watchlists, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{watchlists.name}</td>
                                    <td>{watchlists.date}</td>
                                    <td>{watchlists.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Watchlist;