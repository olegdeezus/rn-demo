import React from 'react'
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Platform
} from 'react-native'
import {
  UNIT,
  PRIMARY
} from '../styles'

const Scene = ({ style, children, isPending, ...restProps }) =>
  <View
    style={[styles.scene, style]}
    {...restProps}
  >
    {children}
    <View
      style={[
        styles.pending,
        { opacity: isPending ? 1 : 0 }
      ]}
      pointerEvents={isPending ? 'auto' : 'none'}
    >
      <ActivityIndicator size='large' color={PRIMARY} />
    </View>
  </View>

export default Scene

const styles = StyleSheet.create({
  scene: {
    marginTop: (Platform.OS === 'ios') ? 64 : 54,
    marginBottom: 8 * UNIT + 1,
    flex: 1
  },
  pending: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  }
})
