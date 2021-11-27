import Moralis from "moralis/node"
import newSoloGame from "./newSoloGame"
import processGameAnswer from "./processGameAnswer"

const run = async () => {
    const gameQuery = new Moralis.Query('Game')
    const gameSubscribtion = await gameQuery.subscribe()

    gameSubscribtion.on('create', async (game) => {
        const { mode } = game.attributes

        if (mode === 'solo') newSoloGame(game)
    })

    gameSubscribtion.on('update', async (game) => {
        const status = game.get('status')

        if (status === 'answered') processGameAnswer(game)
    })
}

export default run