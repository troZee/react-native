/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import * as React from 'react';
import type {RNTesterModule} from '../../types/RNTesterTypes';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const REMOTE_TIMEOUT = 6000;
const LOCAL_TIMEOUT = 3000;
const URL = `https://httpstat.us/200?sleep=${REMOTE_TIMEOUT}`;

type NetworkProvider = 'axios' | 'fetch';

const getNetworkProvider = (provider: NetworkProvider) => {
  switch (provider) {
    case 'fetch':
      return fetch(URL);
    case 'axios':
      return axios.get(URL, {
        timeout: LOCAL_TIMEOUT,
      });
  }
  throw new Error(`null provider for ${provider}`);
};

type Props = {
  provider: NetworkProvider,
};

const NetworkCallWithTimeout = ({provider}: Props) => {
  const [isLoading, setLoading] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const onPress = React.useCallback(() => {
    setLoading(true);
    const timerId = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    getNetworkProvider(provider)
      .then(response => {
        console.log('Responded with data');
        console.log(JSON.stringify(response, null, 2));
      })
      .catch(error => {
        if (error.code === 'ECONNABORTED') {
          console.log('Request timed out');
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        clearInterval(timerId);
        setSeconds(0);
      });
  }, [provider]);

  return (
    <View>
      <Pressable
        disabled={isLoading}
        testID="alert-with-default-button"
        style={styles.wrapper}
        onPress={onPress}>
        <View style={styles.button}>
          <Text>{`${isLoading ? 'loading' : 'Tap to make an API call'}`}</Text>
        </View>
      </Pressable>
      {isLoading ? <ActivityIndicator /> : null}
      {seconds ? (
        <View style={styles.button}>
          <Text>{`${
            seconds * 1000 > LOCAL_TIMEOUT
              ? `❌ TIMEOUT DOES NOT WORK ${seconds}`
              : seconds
          }`}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
  logContainer: {
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  promptValue: {
    marginBottom: 10,
  },
});

export const examples = [
  {
    title: 'Fetch with timeout',
    description: '',
    render(): React.Node {
      return <NetworkCallWithTimeout provider="fetch" />;
    },
  },

  {
    title: 'Axios with timeout',
    description: '',
    render(): React.Node {
      return <NetworkCallWithTimeout provider="axios" />;
    },
  },
];

export default ({
  framework: 'React',
  title: 'Fetch',
  category: 'UI',
  documentationURL: 'https://reactnative.dev/docs/',
  description: '',
  examples,
}: RNTesterModule);
