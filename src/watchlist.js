import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import './css/header.css';
import './css/watchlist.css';
import './css/rename.css';
import Header from './Header';

function Watchlist() {
    const [searchInput, setSearchInput] = useState('');
    const [watchlists, setWatchlists] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState('');
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [showRenameOverlay, setShowRenameOverlay] = useState(false);
    const [triggerEffect, setTriggerEffect] = useState(false);

    useEffect(() => {
        const getWatchlist = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/get_watchlist');
                const fetchedWatchlists = response.data;
                setWatchlists(fetchedWatchlists);
            } catch (error) {
                console.log('Error get watclist: ', error);
            }
        }

        getWatchlist();

        if (triggerEffect) {
            getWatchlist();
            setTriggerEffect(false);
        }

    }, [triggerEffect]);

    const filteredWatchlists = watchlists.filter(watchlists =>
        watchlists.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        watchlists.date.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handleConfirmDelete = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/delete_watchlist', {
                deleteTarget,
            });
            if (response.data.condition === true) {
                console.log(response.data.message);
                setTriggerEffect(true);
                setDeleteTarget('');
                setShowDeleteOverlay(false);
                toast.success('Watchlist deleted successfully !', {
                    position: 'bottom-left'
                });
            } else {
                console.log('not deleted');
                toast.error('Error delete watchlist', {
                    position: 'bottom-left'
                });
            }
        } catch (error) {
            console.log("Error to delete: ", error);
        }
    };

    const handleDelete = async (watchlist) => {
        setShowDeleteOverlay(true);
        setDeleteTarget(watchlist);
    };

    const handleCancelButton = () => {
        setShowDeleteOverlay(false);
        setShowRenameOverlay(false);
    };

    const handleEdit = async (watchlist) => {
        setShowRenameOverlay(true);
    };

    return (
        <>
            <Header searchInput={searchInput} setSearchInput={setSearchInput} />
            <ToastContainer />
            {showDeleteOverlay && (
                <div class="confirmOverlay" id="deleteOverlay">
                    <div class="confirmPopup">
                        <div class="confirmWrapper">
                            <div class="confirmHeader">
                                <h5>Confirm to delete?</h5>
                            </div>
                            <div class="confirmBody">
                                <div class="confirmButtons">
                                    <button type="button" class="cancelButton" id="deleteCancelButton" onClick={handleCancelButton}>Cancel</button>
                                    <input type="submit" class="confirmButton" value="Confirm" id="confirmButton" onClick={handleConfirmDelete}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showRenameOverlay && (
                <div class="renameOverlay" id="renameOverlay">
                    <div class="renamePopup">
                        <div class="renameHeader">
                            <h5>Rename watchlist</h5>
                            <button id="renameCloseButton" onClick={handleCancelButton}><i class="bi bi-x-lg"></i></button>
                        </div>
                        <div class="renameBody">
                            <form id="renameForm">
                                <div class="renameWrapper">
                                    <div class="renamePrompt">
                                        <h6>Enter the new screen name:</h6>
                                        <input type="text" autocomplete="off" id="renameInput" name="collection_name" required></input>
                                        <h6 id="renameMsg"><span id="saveIcon"></span>&nbsp;<span id="saveAlert"></span></h6>
                                    </div>
                                    <div class="renameButtons">
                                        <button type="button" class="cancelButton" id="cancelButton" onClick={handleCancelButton}>Cancel</button>
                                        <input type="submit" class="confirmButton" value="Save" id="saveButton2"></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <div id="watchlistWrapper">
                <div class="utility" id="watchlistUtility">
                    <h3 id="watchlistName">My watchlist</h3>
                </div>
                <div class="tableview" id="wlTableView">
                    <table id="wltable">
                        <thead id="wlhead">
                            <tr>
                                <th id="noColumn" >#</th>
                                <th id="watchlistColumn" >Watchlist</th>
                                <th id="datecColumn">Date Created</th>
                                <th id="timecColumn">Time Created</th>
                                <th id="dltColumn"></th>
                            </tr>
                        </thead>
                        <tbody id="wlbody">
                            {filteredWatchlists.map((watchlists, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td id={index}>{watchlists.name}</td>
                                    <td>{watchlists.date}</td>
                                    <td>{watchlists.time}</td>
                                    <td id='dltCell'>
                                        <button id='wthButton' value={watchlists.name}><i className='bi bi-eye'></i></button>
                                        <button id='edtButton' onClick={() => handleEdit(watchlists.name)}><i className='bi bi-pencil-square'></i></button>
                                        <button id='dltButton' onClick={() => handleDelete(watchlists.name)}><i className='bi bi-trash3'></i></button>
                                    </td>
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