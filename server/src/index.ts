import logger from './utils/logger'
import { createServer } from 'http'
import Moralis from 'moralis/node'
import runListeners from './listeneres'

const PORT = process.env.PORT || 8080

const server = createServer()

server.listen(PORT, () => {
    logger.info(`APP IS RUNNING ON PORT: ${PORT}`)

    Moralis.start({ appId: process.env.MORALIS_APP_ID, serverUrl: process.env.MORALIS_SERVER_URL, masterKey: process.env.MORALIS_MASTER_KEY })

    runListeners()
})