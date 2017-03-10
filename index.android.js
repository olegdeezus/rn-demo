import * as React from 'react'
import { AppRegistry } from 'react-native'
import Root from './src/containers/Root'
import { Provider } from 'react-redux'
import { configureStore } from './src/reducers'

const store = configureStore()

const ProviderContainer = (props) =>
  <Provider store={props.store}>
    <Root />
  </Provider>

ProviderContainer.propTypes = {
  store: React.PropTypes.object
}

class Main extends React.Component {
  render () {
    return (
      <ProviderContainer store={store} />
    )
  }
}

AppRegistry.registerComponent('vezdeapp', () => Main)
