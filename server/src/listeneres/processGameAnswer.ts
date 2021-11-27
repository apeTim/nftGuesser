import Moralis from "moralis/node"
import logger from "../utils/logger"

export default async function (game: Moralis.Object<Moralis.Attributes>) {
    try {
        const question = await game.get('question1').fetch()
        const isCorrect = (question.get('collection').id === game.get('answer').id)
        const player = await game.get('player1').fetch({ useMasterKey: true })

        console.log(`player: ${player}`)

        if (isCorrect) {
            player.set('streak', player.get('streak') + 1, { useMasterKey: true })
            game.set('status', 'won')
        } else {
            player.set('streak', 0, { useMasterKey: true })
            game.set('status', 'lost')
        }
        game.set('active', false)

        Moralis.Object.saveAll([player, game], { useMasterKey: true })
    } catch (e) {
        logger.error(`Error: ${e}`)
        game.set('active', false)
        game.set('status', 'errored')
        game.save()
    }
}