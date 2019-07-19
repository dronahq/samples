import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class Details extends React.Component {

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Details',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Your Details here!</Text>

        <Text style={styles.TextStyle}>
          {this.props.navigation.state.params.Deep_linking_data
            ? this.props.navigation.state.params.Deep_linking_data
            : 'No Value Passed'}
        </Text>

        <Button
          title="Back to home"
          onPress={() =>
            this.props.navigation.navigate('Home')
          }
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});