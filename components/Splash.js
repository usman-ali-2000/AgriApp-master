import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import theme from "../theme/GlobalTheme";

export default function Splash({navigation}){

    useEffect(()=>{
        setTimeout(() => {
            navigation.replace('Login');
        }, 2000);
    },[])

    return(
        <View style={{flex:1, width:'100%', alignItems:'center', justifyContent:'center', backgroundColor:theme.colors.white, }}>
        <Image style={{height:200, width:200, borderRadius:100}} source={require('../assets/farmer.png')}/>
        <Text style={{width:'100%', textAlign:'center', fontSize:30, fontWeight:'600', color:theme.colors.black, paddingTop:'20%'}}>Farm <Text style={{color:theme.colors.blue}}>Management</Text> System</Text>
        </View>
    )
}