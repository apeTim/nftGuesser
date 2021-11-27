import Moralis from "moralis/node";

export default interface RandomNft {
    fullImage: string,
    pieceBuffer: Buffer,
    collection: Moralis.Object<Moralis.Attributes>,
    nftName: string
}