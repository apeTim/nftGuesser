import axios from 'axios'
import Moralis from 'moralis/node'
import sharp from 'sharp'
import logger from './logger'
import RandomNft from '../interfaces/RandomNft'

const PIECE_SIZE = 100
const IMAGE_SIZE = 1000

function retryFailedRequest(err) {
    if ((err.status === 500 || err.status === 502) && err.config && !err.config.__isRetryRequest) {
        err.config.__isRetryRequest = true;
        return axios(err.config);
    }
    throw err;
}
axios.interceptors.response.use(undefined, retryFailedRequest);

const getRandomNFT = async (): Promise<RandomNft> => {
    try {
        const collectionQuery = new Moralis.Query('Collection')
        const collections = await collectionQuery.find()
        const randomCollectionIndex = Math.round((Math.random() * 10 ** 9)) % collections.length
        const collection = collections[randomCollectionIndex]


        const collectionName = collection.get("name")
        const collectionStock = collection.get("stock")

        const randomNftIndex = Math.round((Math.random() * 10 ** 9)) % collectionStock

        try {
            console.log('requesting')
            const response = await axios.get(`https://api.nftport.xyz/v0/nfts/${collection.get("contractAddress")}/${randomNftIndex}?chain=${collection.get("chain")}`, {
                headers: {
                    'Authorization': process.env.NFTPORT_APIKEY,
                    'Content-Type': 'application/json'
                }
            })

            const randomNFT = response.data.nft
            const nftName = `${collectionName} #${randomNftIndex}`

            const randomNumber1 = Math.round(Math.random() * (10 ** 9))
            const randomNumber2 = Math.round(Math.random() * (10 ** 9))

            const nftImage = randomNFT.cached_file_url
            const input = (await axios({ url: nftImage, responseType: "arraybuffer" })).data as Buffer;

            const output = await sharp(input)

            const leftStart = randomNumber1 % (IMAGE_SIZE - PIECE_SIZE * 2 * 1.5) + PIECE_SIZE * 1.5
            const topStart = randomNumber2 % (IMAGE_SIZE - PIECE_SIZE * 2 * 1.5) + PIECE_SIZE * 1.5

            const pieceBuffer = await output.png().resize({
                fit: sharp.fit.cover,
                width: IMAGE_SIZE
            }).extract({ width: PIECE_SIZE, height: PIECE_SIZE, left: leftStart, top: topStart }).toBuffer()

            return { fullImage: nftImage, pieceBuffer, collection, nftName }
        } catch (e) {
            logger.error(`ERROR WHILE PROCESSING COLLECTION ${collectionName}:${randomNftIndex}. MSG: ${e.message}`)
        }
    } catch (e) {
        logger.error('ERROR WHILE GETTING COLLECTION')
    }
}

export default getRandomNFT