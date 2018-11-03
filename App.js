import React from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { AppLoading, Asset, Font, Icon } from 'expo'
import AppNavigator from './src/navigation/AppNavigator'

import * as firebase from 'firebase'

import config from './config/default.json'

firebase.initializeApp(config.FIREBASE__CREDENTIALS)

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    user: undefined,
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    }

    const { user } = this.state

    return (
      <View style={styles.container}>
        <AppNavigator screenProps={{ user }} />
      </View>
    )
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        this.setState({ user })
      } else {
        this.setState({ user: null })
      }
    })
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ])
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})
