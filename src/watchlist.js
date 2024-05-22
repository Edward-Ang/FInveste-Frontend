import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/watchlist.css';
import './css/rename.css';
import Header from './Header';

function Watchlist() {
    const [searchInput, setSearchInput] = useState('');
    const [watchlists, setWatchlists] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState('');
    const [renameInput, setRenameInput] = useState('');
    const [renameTarget, setRenameTarget] = useState('');
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [showRenameOverlay, setShowRenameOverlay] = useState(false);
    const [triggerEffect, setTriggerEffect] = useState(false);
    const navigate = useNavigate();

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
                toast.error(response.data.error, {
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
        setRenameInput('');
    };

    const handleEdit = async (watchlist) => {
        setShowRenameOverlay(true);
        setRenameTarget(watchlist);
    };

    const handleRename = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/rename_watchlist', {
                renameTarget,
                renameInput
            });

            if(response.data.condition === true){
                console.log(response.data.message);
                setTriggerEffect(true);
                setRenameTarget('');
                setRenameInput('');
                setShowRenameOverlay(false);
                toast.success('Watchlist renamed successfully !', {
                    position: 'bottom-left'
                });
            }else{
                if(response.data.message === 'Name exist'){
                    toast.error('This name already exists. Please choose a different name.', {
                        position: 'bottom-left'
                    });
                }
                console.log(response.data.message);
            }

        } catch (error) {
            console.log("Error to rename: ", error);
        }
    }

    const handleView = async (wId, wName) => {
        navigate('/screen', { state: { watchlistId: wId, watchlistName: wName } });
    };

    return (
        <>
            <Header searchInput={searchInput} setSearchInput={setSearchInput} />
            <ToastContainer />
            {showDeleteOverlay && (
                <div className="confirmOverlay" id="deleteOverlay">
                    <div className="confirmPopup" id='confirmPopup'>
                        <div className="confirmWrapper">
                            <div className="confirmHeader">
                                <h5>Confirm to delete?</h5>
                            </div>
                            <div className="confirmBody">
                                <div className="confirmButtons">
                                    <button type="button" className="cancelButton" id="deleteCancelButton" onClick={handleCancelButton}>Cancel</button>
                                    <input type="submit" className="confirmButton" value="Confirm" id="confirmButton" onClick={handleConfirmDelete}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showRenameOverlay && (
                <div className="renameOverlay" id="renameOverlay">
                    <div className="renamePopup" id='renamePopup'>
                        <div className="renameHeader">
                            <h5>Rename watchlist</h5>
                            <button id="renameCloseButton" onClick={handleCancelButton}><i className="bi bi-x-lg"></i></button>
                        </div>
                        <div className="renameBody">
                            <form id="renameForm">
                                <div className="renameWrapper">
                                    <div className="renamePrompt">
                                        <h6>Enter the new screen name:</h6>
                                        <input type="text" autoComplete="off" id="renameInput" name="collection_name" value={renameInput} onChange={(e) => setRenameInput(e.target.value)} required></input>
                                        <h6 id="renameMsg"><span id="saveIcon"></span>&nbsp;<span id="saveAlert"></span></h6>
                                    </div>
                                    <div className="renameButtons">
                                        <button type="button" className="cancelButton" id="cancelButton" onClick={handleCancelButton}>Cancel</button>
                                        <input type="submit" className="confirmButton" value="Save" id="saveButton2" onClick={handleRename}></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <div id="watchlistWrapper">
                <div className="utility" id="watchlistUtility">
                    <h3 className='watchlistName' id="watchlistName">My watchlist</h3>
                </div>
                <div className="tableview" id="wl">
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
                                    <td className='dltCell' id='dltCell'>
                                        <button id='wthButton' onClick={() => handleView(watchlists._id, watchlists.name)}><i className='bi bi-eye'></i></button>
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