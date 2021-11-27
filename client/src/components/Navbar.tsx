import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Moralis from 'moralis/node';

import '../css/Navbar.css'
import { useMoralis } from 'react-moralis';
import { Link } from 'react-router-dom';
import shortAddress from '../utils/shortAddress';
import getLogo from '../utils/getLogo';

const Navbar = () => {

    const { authenticate, logout, isAuthenticated, user } = useMoralis()
    const [cpath, setCPath] = useState(window.location.pathname.substr(1))

    return (
        <div className='nav_bar'>
            <div className='top'>
                <div className='logo'>
                    <img src='./logo.png' />
                    <h2>NFT <br /> <b>GUESSER</b></h2>
                </div>
                <hr />
                <div className='menu'>
                    <div className='item'>
                        <img src='./icons/home.svg' />
                        <Link to='/'><h3>Home</h3></Link>
                    </div>
                    <div className='item'>
                        <img src='./icons/soloGame.svg' />
                        <Link to='/solo'><h3>Solo Game</h3></Link>
                    </div>
                    <div className='item'>
                        <img src='./icons/lb.svg' />
                        <Link to='/lb'><h3>Leaderboard</h3></Link>
                    </div>

                </div>
            </div>
            <div className='bottom'>
                {isAuthenticated
                    ? (
                        <div className='profile_bar'>
                            <div className='profile_info'>
                                <div className='profile_pic'>
                                    <img src={getLogo(user?.get('ethAddress'))} />
                                </div>
                                <div className='profile_data'>
                                    <p className='profile_address'>{shortAddress(user?.get('ethAddress'))}</p>
                                    <p className='profile_streak'>{user?.get('streak')} Streak</p>
                                </div>
                            </div>
                            <div onClick={() => logout()} className='logout'>
                                <img src='./icons/logout.svg' />
                            </div>
                        </div>
                    )
                    : (
                        <div className='profile_bar'>
                            <button onClick={() => authenticate()}>Sign In</button>
                        </div>
                    )
                }
            </div>
        </div >
    );
};
export default Navbar;
