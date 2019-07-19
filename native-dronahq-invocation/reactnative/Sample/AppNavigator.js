import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Home from './screens/Home';
import Details from './screens/Details';

const AppNavigator = createStackNavigator({
    Home: { 
        screen: Home,
    },
	Details: { 
        screen: Details,
    }
},
{
	initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);