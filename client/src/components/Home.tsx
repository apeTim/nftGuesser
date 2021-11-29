import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube'
import '../css/Home.css'
import 'react-dropdown/style.css';

const ytOpts = {
    height: '390',
    width: '640'
};

function Home() {

    return (
        <div className='home section'>
            <h1 className='section_title'>About us</h1>
            <div className='about_us'>
                <p>Our game shows the user a small 100x100 piece of a
                    random NFT that belongs to a known list of collections.
                    The user has to figure out to what collection shown piece belongs.</p>
                <p>For each correct guess your streak
                    increases. For a wrong guess, your streak goes to 0.
                    Stay at the top of the streaks leaderboard to win cool prizes!</p>
            </div>

            <YouTube videoId="MBOhQIRTUPo" opts={ytOpts} onReady={(e) => e.target.pauseVideo()} />

            <div className='bottom'>
                <div className='group'>
                    <h3>Built with</h3>
                    <div className='companies'>
                        <img src='./images/moralis.svg' />
                        <img src='./images/nftPort.png' />
                    </div>
                </div>
                <div className='group'>
                    <h3>Media</h3>
                    <div className='companies'>
                        <img src='./images/twitter.svg' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
