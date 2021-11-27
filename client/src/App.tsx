import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
//@ts-ignore
import Moralis from 'moralis/node'

import Navbar from './components/Navbar';
import Game from './components/Game';

import './css/App.css'
import Leaderboard from './components/Leaderboard';
import Home from './components/Home';

function App() {

  Moralis.start({ appId: process.env.REACT_APP_MORALIS_APP_ID, serverUrl: process.env.REACT_APP_MORALIS_SERVER_URL, masterKey: process.env.REACT_APP_MORALIS_MASTER_KEY })

  return (
    <div className='app'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={< Home />} />
          <Route path='/solo' element={< Game />} />
          <Route path='/lb' element={< Leaderboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
