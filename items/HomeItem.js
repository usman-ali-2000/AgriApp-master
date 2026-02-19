import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default HomeItem=(props)=>{

    return(
        <TouchableOpacity onPress={props.onPress} style={styles.container}>
            <Image style={styles.image} source={props.image}/>
            <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image:{
        height:50,
        width:50
    },
    container:{
        height:'70%',
        width:'25%',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'white',
        elevation:5,
        justifyContent:'center',
        margin:'2%'
    },
    text:{
        fontSize:16,
        fontWeight:'600',
        color:'black'
    }
})