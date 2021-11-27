import React, { useEffect, useState } from 'react';

import Dropdown from 'react-dropdown';
//@ts-ignore
import { useMoralis, useMoralisSubscription } from "react-moralis";
import Moralis from 'moralis/node'

import '../css/Game.css'
import 'react-dropdown/style.css';

function Game() {

    const [existingGame, setExistingGame] = useState<Moralis.Object<Moralis.Attributes> | null>(null)
    const [collections, setCollections] = useState<Array<Moralis.Object<Moralis.Attributes>>>([])
    const [question, setQuestion] = useState<Moralis.Object<Moralis.Attributes> | null>(null)
    const [answer, setAnswer] = useState<string | undefined>(undefined)
    const [correctAnswer, setCorrectAnswer] = useState<Moralis.Object<Moralis.Attributes> | null>(null)
    const [pieceImage, setPieceImage] = useState<string | null>(null)

    const { user, setUserData } = useMoralis();

    useEffect(() => {
        if (!user) return

        const check = async () => {
            const existingGameQuery = new Moralis.Query('Game')
            existingGameQuery.equalTo('mode', 'solo')
            existingGameQuery.equalTo('active', true)
            existingGameQuery.equalTo('player1', user.toPointer())

            const existingGame = (await existingGameQuery.find())[0]

            if (!existingGame) return

            if (existingGame.get('status') !== 'waitingAnswer') {
                setExistingGame(existingGame)
                return
            }

            const question = await existingGame.get("question1").fetch()
            const pieceImage = btoa(String.fromCharCode(...new Uint8Array(question.get("pieceBuffer").data)));

            setPieceImage(pieceImage)
            setQuestion(question)
            setExistingGame(existingGame)
        }

        check()
    }, [user])

    useMoralisSubscription("Game", q => q, [], {
        onUpdate: async data => {
            if (data.id === existingGame?.id) {

                if (data.get('status') === 'waitingAnswer') {
                    const question = await data.get('question1').fetch()
                    const pieceImage = btoa(String.fromCharCode(...new Uint8Array(question.get("pieceBuffer").data)));
                    console.log({ pieceImage })

                    setPieceImage(pieceImage)
                }
                else if (data.get('status') === 'won' || data.get('status') === 'lost') {
                    setExistingGame(data)
                    const newUser = await user?.fetch()
                    setUserData({ streak: newUser?.get('streak') })
                    const correctAnswer = await data.get("question1").fetch()

                    setCorrectAnswer(correctAnswer)
                }
            }
        },
    })

    useEffect(() => {
        const getCollecions = async () => {
            const collectionsQuery = new Moralis.Query('Collection')
            const collections = await collectionsQuery.find()

            setCollections(collections)
            setAnswer(collections[0].id)
        }

        getCollecions()
    }, [])

    const answerQuestion = async () => {
        if (!existingGame) return

        const collection = collections.find(c => c.id === answer)
        existingGame?.set('answer', collection)
        existingGame?.set('status', 'answered')

        await existingGame.save()
    }

    const reStartSoloGame = () => {
        setExistingGame(null)
        setAnswer(collections[0].id)
        setPieceImage(null)
        setCorrectAnswer(null)
        setQuestion(null)

        startSoloGame()
    }

    const startSoloGame = async () => {
        if (!user) return

        if (existingGame && existingGame.get('active')) {
            console.log('You already have running game!')
            console.log({ existingGame })
            return
        }

        const Game = Moralis.Object.extend('Game')
        const game = new Game()
        game.set('mode', 'solo')
        game.set('active', true)
        game.set('status', 'preparing')
        game.set('player1', user.toPointer())

        const newGame = await game.save()

        setExistingGame(newGame)
    }

    return (
        <div className='game section'>
            <h1 className='section_title'>Solo Game</h1>
            {user ?
                <>{existingGame ? (
                    <div>
                        {existingGame.get('active') ? (
                            <>
                                {existingGame.get('status') === 'preparing' && !pieceImage ? (
                                    <h2>We are generating random NFT, wait a sec!</h2>
                                ) : (
                                    <>
                                        <h3>NFT Piece:</h3>
                                        <img className='piece_image' src={`data:image/png;base64,${pieceImage}`} alt="" />
                                        <h3>Select Collection</h3>
                                        <Dropdown options={collections.map(c => ({ value: c.id, label: c.get('name') }))} onChange={e => setAnswer(e.value)} value={answer} placeholder="Select an option" />
                                        <button className='submit_answer' onClick={answerQuestion}>Submit!</button>
                                    </>
                                )
                                }
                            </>
                        )
                            : <div className='gameEnd'>
                                <button className='play_again' onClick={reStartSoloGame}>Play Again!</button>
                                {existingGame.get('status') === 'won' ? (
                                    <>
                                        <h3>Congratulations! You won!</h3>
                                        <h3>It was {correctAnswer?.get("nftName")}</h3>
                                        <img className='piece_image' src={correctAnswer?.get("fullImage")} />
                                    </>
                                ) : (
                                    <>
                                        <h3>I'm sorry, but you lost.</h3>
                                        <h3>It was {correctAnswer?.get("nftName")}</h3>
                                        < img className='piece_image' src={correctAnswer?.get("fullImage")} />
                                    </>
                                )}
                            </div>
                        }
                    </div>
                )
                    : (<div>
                        <button className='start_game' onClick={startSoloGame}>Start!</button>
                    </div>)
                }</> : null}
        </div>
    );
}

export default Game;
