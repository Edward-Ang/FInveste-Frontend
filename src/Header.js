import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import './css/header.css';

const Header = ({ searchInput, setSearchInput }) => {
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowConfirmLogout(true); // Show the logout confirmation overlay
    };

    const handleCancelLogout = () => {
        setShowConfirmLogout(false); // Hide the logout confirmation overlay
    };

    const handleConfirmLogout = async () => {
        try {
            const response = await axios.get('http://54.179.119.22:5000/api/logout');

            if (response.data.message === 'Logged out') {
                // Redirect response from the server
                navigate('/login');
            } else {
                console.log('Unexpected response status:', response.message);
            }
        } catch (error) {
            console.log('Error logout: ', error);
        }
    };

    const handleNavigate = () => {
        navigate('/watchlist');
    };

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
        console.log(showDropdown);
    }

    return (
        <header>
            <div className='header-wrapper' id='header-wrapper' >
                <div className="headerbar" id='headerbar'>
                    <div className="headerLogo" id='headerLogo'>
                        <img src="/images/6888.KL.svg" alt="logo" id='logo' />
                        <Link to="/home" className='header-link' id='header-link'>FInvesté</Link>
                    </div>
                    <div className="searchbar" id='searchbar' onClick={(event) => event.stopPropagation()}>
                        <input type="text" autoComplete="off" className='filterInput' id="filterInput" placeholder="Search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    </div>
                    <div className="headerIcon" id="dropdownMenu">
                        <Dropdown as={ButtonGroup} show={showDropdown}>
                            <Dropdown.Toggle className='dropdownButton' id="dropdownButton" onClick={handleDropdown} variant="secondary">
                                <i className="fa-solid fa-bars"></i>
                            </Dropdown.Toggle>
                            <ul className='dropdownContent' id="dropdownContent">
                                <li id="watchlistButtonLi">
                                    <Link to="/watchlist" className='watchlistButton' id="watchlistButton">Watchlist</Link>
                                </li>
                                <li id='logoutButtonLi'>
                                    <button className='accountButton' id="accountButton" onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                            {showDropdown && (
                                <>
                                    <Dropdown.Menu id="dropdownContentReact">
                                        <Dropdown.Item as="button" id="watchlistButton" onClick={handleNavigate}>
                                            Watchlist
                                        </Dropdown.Item>
                                        <Dropdown.Item as="button" id="accountButton" onClick={handleLogout}>
                                            Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </>
                            )}
                        </Dropdown>
                    </div>
                </div>
            </div>
            {/* Logout confirmation overlay */}
            {showConfirmLogout && (
                <div className="confirmOverlay" id="logoutOverlay">
                    <div className="confirmPopup" id='confirmPopup'>
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
        </header>
    );
};

export default Header;
