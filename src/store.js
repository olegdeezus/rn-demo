import { AsyncStorage } from 'react-native'
import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers
} from 'redux'
import thunk from 'redux-thunk'
import persistState, { mergePersistedState } from 'redux-localstorage'
import adapter from 'redux-localstorage/lib/adapters/AsyncStorage'
import filter from 'redux-localstorage-filter'
import tickets from './modules/tickets/reducer'
import transports from './modules/transports/reducer'

const isStateLoaded = (state = false, { type }) => {
  switch (type) {
    case 'redux-localstorage/INIT': return true
    default: return state
  }
}

export const configureStore = () => {
  const rootReducer = combineReducers({
    transports,
    tickets
  })

  const reducer = compose(
    mergePersistedState()
  )(rootReducer)

  const storage = compose(
    filter([
      'token',
      'tokenExpiresIn',
      'mobileNumber',
      'firstName',
      'lastName',
      'email'
    ])
  )(adapter(AsyncStorage))

  const enhancer = compose(
    applyMiddleware(thunk),
    persistState(storage)
  )

  const devtools = window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()

  return createStore(
    reducer,
    devtools,
    enhancer
  )
}
