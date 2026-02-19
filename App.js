import { StyleSheet } from 'react-native'
import React from 'react'
import Home from './components/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from './components/Menu';
import Farms from './components/Farms';
import Plot from './components/Plot';
import Variety from './components/Variety';
import Product from './components/Product';
import Category from './components/Category';
import Implements from './components/Implements';
import IrrigationSr from './components/IrrigationSr';
import Job from './components/Job';
import DailyEntry from './components/DailyEntry';
import Stages from './components/Stages';
import Vehicle from './components/Vehicle';
import Search from './components/Search';
import theme from './theme/GlobalTheme';
import Login from './components/Login';
import Splash from './components/Splash';
import UpdateDailyEntry from './components/UpdateDailyEntry';
import FarmReport from './components/FarmReport';
import Reports from './components/Reports';

const Stack = createNativeStackNavigator();

const hello = () => {
  return(
    <NavigationContainer>
    <Stack.Navigator
    screenOptions={{
      headerStyle:{
        backgroundColor:theme.colors.blue,
      },
      headerTintColor:theme.colors.white,
    }}
    initialRouteName='Splash'>
      <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Menu" component={Menu}/>
          <Stack.Screen name="Farms" component={Farms}/>
          <Stack.Screen name="Plot" component={Plot}/>
          <Stack.Screen name="Variety" component={Variety}/>
          <Stack.Screen name="Product" component={Product}/>
          <Stack.Screen name="Category" component={Category}/>
          <Stack.Screen name="Implements" component={Implements} />
          <Stack.Screen name="IrrigationSr" component={IrrigationSr} options={{title:"Irrigation Source"}}/>
          <Stack.Screen name="Job" component={Job}/>
          <Stack.Screen name="DailyEntry" component={DailyEntry}/>
          <Stack.Screen name="UpdateDailyEntry" component={UpdateDailyEntry}/>
          <Stack.Screen name="Stages" component={Stages}/>
          <Stack.Screen name="Vehicle" component={Vehicle}/>
          <Stack.Screen name="Search"  component={Search}/>
          <Stack.Screen name="FarmReport"  component={FarmReport}/>
          <Stack.Screen name="Reports"  component={Reports}/>
    </Stack.Navigator>
    </NavigationContainer>
  )
}

export default hello


const styles = StyleSheet.create({})