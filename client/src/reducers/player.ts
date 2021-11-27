import Moralis from "moralis/types"

enum PlayerActions {
    LOAD_PLAYER = 'LOAD_PLAYER'
}

interface LoadUserAction {
    type: PlayerActions.LOAD_PLAYER,
    payload: Moralis.User<Moralis.Attributes>
}

type PlayerAction = LoadUserAction


export default (state: Moralis.User<Moralis.Attributes> | null = null, action: PlayerAction): Moralis.User<Moralis.Attributes> | null => {

    switch (action.type) {
        case PlayerActions.LOAD_PLAYER: {
            return action.payload
        }
        default:
            return state
    }
}