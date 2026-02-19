import React from "react";
import { View, Text, Image, Pressable } from "react-native";

export default function Inputform(props){

    return(
        <View style={{flexDirection:'column', width:'100%', paddingRight:5, paddingTop:5}}>
        <Text style={{fontWeight:'bold', color:'black', textAlign:'center', verticalAlign:'middle'}}>{props.heading}</Text>
        <Pressable onPress={props.onPress}>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', height:40, borderRadius:8}}>
        <Text
        style={{
            width:'80%', verticalAlign:"middle", color:'black', paddingLeft:'2%'
        }}
        >{props.text}</Text>
        <Image source={require('../assets/down.png')} style={{height:15, width:15, alignSelf:'center', marginTop:5, marginLeft:'5%', borderWidth: props.openDrop?1:0, padding:5}}/>
        </View>
        </Pressable>
        {props.openDrop ? <View style={{height:80}}>{props.Dropdown}</View>:''}
        </View>
    )
}