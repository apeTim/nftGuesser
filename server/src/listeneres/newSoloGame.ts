import Moralis from "moralis/node"
import logger from "../utils/logger"
import getRandomNFT from "../utils/getRandomNFT"

export default async function (game: Moralis.Object<Moralis.Attributes>) {
    try {
        game.set('status', 'waitingQuestion')
        await game.save()

        const { fullImage, pieceBuffer, collection, nftName } = await getRandomNFT()

        const Question = Moralis.Object.extend('Question')
        const newQuestion = new Question()
        newQuestion.set('fullImage', fullImage)
        newQuestion.set('pieceBuffer', pieceBuffer.toJSON())
        newQuestion.set('collection', collection.toPointer())
        newQuestion.set('nftName', nftName)

        await newQuestion.save()

        game.set('question1', newQuestion)
        game.set('status', 'waitingAnswer')

        await game.save()
    } catch (e) {
        logger.error(`Error: ${e}`)
        game.set('active', false)
        game.set('status', 'errored')
        game.save()
    }
}