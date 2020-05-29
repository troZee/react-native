/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const RNTesterActions = require('./utils/RNTesterActions');
const RNTesterExampleContainer = require('./components/RNTesterExampleContainer');
const RNTesterExampleList = require('./components/RNTesterExampleList');
const RNTesterList = require('./utils/RNTesterList.ios');
const RNTesterNavigationReducer = require('./utils/RNTesterNavigationReducer');
const React = require('react');
const SnapshotViewIOS = require('./examples/Snapshot/SnapshotViewIOS.ios');
const URIActionMap = require('./utils/URIActionMap');

const {
  AppRegistry,
  AsyncStorage,
  BackHandler,
  Button,
  Linking,
  Platform,
  SafeAreaView,
  TouchableHighlight,
  StyleSheet,
  Image,
  Text,
  useColorScheme,
  Dimensions,
  View,
  LogBox,
} = require('react-native');

import type {RNTesterExample} from './types/RNTesterTypes';
import type {RNTesterAction} from './utils/RNTesterActions';
import type {RNTesterNavigationState} from './utils/RNTesterNavigationReducer';
import {RNTesterThemeContext, themes} from './components/RNTesterTheme';
import type {ColorSchemeName} from '../../Libraries/Utilities/NativeAppearance';

type Props = {exampleFromAppetizeParams?: ?string, ...};

LogBox.ignoreLogs(['Module RCTImagePickerManager requires main queue setup']);

const APP_STATE_KEY = 'RNTesterAppState.v2';

import image0 from './assets/call.png';
import image1 from './assets/dislike.png';
import image2 from './assets/flowers.png';
import image3 from './assets/hawk.png';
import image4 from './assets/trees.jpg';

const images = [image0, image1, image2, image3, image4];
class RNTesterApp extends React.Component<Props, RNTesterNavigationState> {
  state = {
    counter: 0,
  };

  increment = () => {
    this.setState(prev => {
      return {
        counter: (prev.counter % (images.length - 1)) + 1,
      };
    });
  };

  render(): React.Node | null {
    const imageSource = images[this.state.counter];

    return (
      <View>
        <Image source={imageSource} style={styles.image} />
        <TouchableHighlight onPress={this.increment} style={styles.highlight}>
          <Text style={styles.text}>NEXT IMAGE</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
const window = Dimensions.get('window');

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: 'yellow',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  text: {
    fontSize: 50,
  },
  image: {
    width: window.width,
    height: window.height,
  },
  headerContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    height: 40,
    flexDirection: 'row',
  },
  headerCenter: {
    flex: 1,
    position: 'absolute',
    top: 7,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 19,
    fontWeight: '600',
    textAlign: 'center',
  },
  exampleContainer: {
    flex: 1,
  },
});

AppRegistry.registerComponent('SetPropertiesExampleApp', () =>
  require('./examples/SetPropertiesExample/SetPropertiesExampleApp'),
);
AppRegistry.registerComponent('RootViewSizeFlexibilityExampleApp', () =>
  require('./examples/RootViewSizeFlexibilityExample/RootViewSizeFlexibilityExampleApp'),
);
AppRegistry.registerComponent('RNTesterApp', () => RNTesterApp);

// Register suitable examples for snapshot tests
RNTesterList.ComponentExamples.concat(RNTesterList.APIExamples).forEach(
  (Example: RNTesterExample) => {
    const ExampleModule = Example.module;
    if (ExampleModule.displayName) {
      class Snapshotter extends React.Component<{...}> {
        render() {
          return (
            <SnapshotViewIOS>
              <RNTesterExampleContainer module={ExampleModule} />
            </SnapshotViewIOS>
          );
        }
      }

      AppRegistry.registerComponent(
        ExampleModule.displayName,
        () => Snapshotter,
      );
    }
  },
);

module.exports = RNTesterApp;
