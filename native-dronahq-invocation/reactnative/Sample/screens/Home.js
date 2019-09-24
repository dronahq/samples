import React, { Component } from 'react';
import { StyleSheet, View, Linking, Platform, Text, Button } from 'react-native';
import { ToastAndroid } from 'react-native';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };
  }

  static navigationOptions = {
    title: 'Home Page',
  };

  componentDidMount() {
    //Used in both android and ios 
    //But in ios this works only when app is in killed state
    //also make sure to disable remote debugging and live reload
    Linking.getInitialURL().then(url => {
      this.navigate(url);
    });
    if (Platform.OS === 'android') {
      // get the url from intent here
    } else {
      //This is required for receiving the event when app is in background state
      Linking.addEventListener('url', this.handleNavigation); 
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleNavigation);
  }

  handleNavigation = (event) => {
    //Based on the link url from external app, navigate to specific page
    //(event.url === "nativetest://") ? this.goToDetailsPage() : this.goToHomePage()
    //event.url
    this.navigate(event.url);
  }

  navigate = (url) => { // E
    //const { navigate } = this.props.navigation;
    //const route = url.replace(/.*?:\/\//g, '');
    //const id = route.match(/\/([^\/]+)\/?$/)[1];
    //const routeName = route.split('/')[0];

    if (url != null && url.includes('nonce') && url.includes('uid')) {
      this.props.navigation.navigate('Details', {
        Deep_linking_data: url,
      })
    };
  }

  openApp() {
    // Replace nativetest with the scheme name of your app
    const url = 'dhq://?scheme=nativetest';
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }


render() {
return (
  <View style={styles.container}>
    <Button title="Details" onPress={() => this.props.navigation.navigate('Details')}
      />

    <View style={{ margin: 10 }}>
      <Button title="DronaHQ" color="orange" accessibilityLabel="DronaHQ" onPress={() => { this.openApp() } }
        />
    </View>
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

export default Home;