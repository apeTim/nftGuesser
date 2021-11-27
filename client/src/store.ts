import { createStore } from 'redux'
import playerReducer from './reducers/player'


export default createStore(playerReducer)