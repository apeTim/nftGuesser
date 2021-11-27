import logger from 'pino'

export default logger({
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            ignore: 'pid,hostname'
        }
    }
})