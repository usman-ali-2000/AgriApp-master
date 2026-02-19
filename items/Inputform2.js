import React from "react";
import { View, Text, TextInput } from "react-native";

export default function Inputform2(props){

    return(
        <View style={{flexDirection:'column', width:'100%', paddingRight:5, paddingTop:0}}>
        <Text style={{fontWeight:'bold', color:'black'}}>{props.heading}</Text>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', height:40, borderRadius:8}}>
        <TextInput
        style={{
            width:'100%',
            height:40
        }}
        key={props.key}
        onChangeText={props.onChange}
        value={props.value}
        secureTextEntry={false}
        />
        </View>
        </View>
    )
}