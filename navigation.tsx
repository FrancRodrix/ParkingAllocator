import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ParkScreen from './Park';
import Home from './Home';
import Download from './DownloadFile'
import Main from './Class/Screens/Main'
import Detail from './Class/Screens/Detail'
const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Detail"
          component={Detail}
          options={{headerShown: false}}
        />
      <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
      <Stack.Screen
          name="Download"
          component={Download}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ParkScreen"
          component={ParkScreen}
          options={{headerShown: false}}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigation;
