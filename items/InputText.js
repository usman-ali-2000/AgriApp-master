import React, { useState } from "react";
import { Image, StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native";


const InputText=(props)=>{
    
    return(
        <View style={[styles.container,{borderWidth:props.borderWidth}]}>
            <View style={[styles.imageContainer,{width:30}]}>
            <Image style={styles.magnifier} source={require('../assets/magnifier.png')}/>
            </View>
            <TextInput
            placeholderTextColor={'rgba(51, 51, 51, 0.5)'}
            ref={props.ref}
            style={styles.text}
            placeholder={props.placeholder}
            value={props.value}
            onChangeText={props.onChange}
            secureTextEntry={props.secureTextEntry}
            />
            {/* <TouchableOpacity onPress={props.onPress} style={styles.buttonContainer}>
        <Text>Search</Text>
        </TouchableOpacity> */}
        </View>
    )
}
export default InputText;

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        width:'80%',
        alignItems:'center',
        // paddingLeft:20,
        borderRadius:8,
        backgroundColor:'lightgrey',
        marginTop:10,
        height:55,
        borderColor:'lightblue'
 },
    text:{
        fontSize:14,
        fontWeight:'500',
        padding:5,
        width:'90%',
        paddingLeft:10,
        color:'black',
        // backgroundColor:'lighgrey',
        // borderWidth:1
    },
    imageContainer:{
    height:30,
    padding:5
    },
    buttonContainer:{
        width:'10%',
        // borderWidth:1,
        alignItems:'center',
        height:'55%',
        justifyContent:'center',
        backgroundColor:'white',
        margin:'1%'
    },
    magnifier:{
        height:20,
        width:20,
    }
})