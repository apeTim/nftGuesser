import React, { useEffect, useState } from 'react';

//@ts-ignore
import { useMoralis, useMoralisSubscription } from "react-moralis";
import Moralis from 'moralis/node'

import '../css/Leaderboard.css'
import 'react-dropdown/style.css';
import shortAddress from '../utils/shortAddress';
import getLogo from '../utils/getLogo';

function Leaderboard() {

    const [topUsers, setTopUsers] = useState<Array<Moralis.Object<Moralis.Attributes>>>([])

    // useMoralisSubscription("Game", q => q, [], {
    //     onUpdate: async data => {
    //         if (data.id === existingGame?.id) {

    //             if (data.get('status') === 'waitingAnswer') {
    //                 const question = await data.get('question1').fetch()
    //                 const pieceImage = btoa(String.fromCharCode(...new Uint8Array(question.get("pieceBuffer").data)));
    //                 console.log({ pieceImage })

    //                 setPieceImage(pieceImage)
    //             }
    //             else if (data.get('status') === 'won' || data.get('status') === 'lost') {
    //                 setExistingGame(data)
    //                 const newUser = await user?.fetch()
    //                 setUserData({ streak: newUser?.get('streak') })
    //                 const correctAnswer = await data.get("question1").fetch()

    //                 setCorrectAnswer(correctAnswer)
    //             }
    //         }
    //     },
    // })

    useEffect(() => {
        const getTopUsers = async () => {
            const usersQuery = new Moralis.Query('User')
            const topUsers = (await usersQuery.find({ useMasterKey: true })).sort((u1, u2) => u2.get('streak') - u1.get('streak'))

            console.log({ topUsers })

            setTopUsers(topUsers)
        }

        getTopUsers()
    }, [])


    return (
        <div className='leaderboard section'>
            <h1 className='section_title'>Leaderboard</h1>
            <div className='places'>
                {topUsers.map((u, place) => (
                    <div className='position'>
                        <div className='user_data'>
                            <img src={getLogo(u.get('ethAddress'))} />
                            <h2>{place + 1}. {shortAddress(u.get('ethAddress'))}</h2>
                        </div>
                        <div className='streak_data'>
                            <h2>{u.get('streak')} Streak</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Leaderboard;
