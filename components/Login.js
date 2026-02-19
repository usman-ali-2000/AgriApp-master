import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import { View, TextInput, Text, Alert, Pressable, Image } from "react-native";
import theme from '../theme/GlobalTheme';
import { BaseUrl } from "../assets/Data";

export default function Login(){

    const navigation = useNavigation();

    const focusRef = useRef(null);
    const focusRef1 = useRef(null);

    const name = 'usmanzulfiqar14@gmail.com';
    const password = 'usman12345'

    const [inputText, setInputText] = useState(name);
    const [inputPass, setInputPass] = useState(password);
    const [idcheck, setIdCheck] = useState(false);
    const [userData, setUserData] = useState([]);
    const [passCheck, setPassCheck] = useState('');


    const fetchData=async()=>{
        try{
          const response = await fetch(`${BaseUrl}/login`);
          const json = await response.json();
          console.log('json:', json); 
          setUserData(json);
    
          }catch(error){
            console.log('error in fetching');
          }
          
        }

        useEffect(()=>{
          handleFocus();
          fetchData();
        },[]
        );

    const handleTextChange = (text) => {
      setInputText(text);
      if(text){
        const checkName = userData.find((item) => item.email === text);
        if(checkName !== undefined){
        setIdCheck(true); // Set idCheck to true if checkName is truthy, otherwise false
      } else {
        setIdCheck(false);
      }
    }
    };

    const handlepass=(text)=>{
        setInputPass(text);
        if(text){
            const checkPass = userData.find((item)=> item.password === text);
            if(checkPass !== undefined){
                setPassCheck(true);
            }
            else
            {
                setPassCheck(false);
            }
        }
    }

    const handleButton=()=>{
      // fetchData();
      // if(inputText !== '' && inputPass !== '' ){
      //   if(idcheck && passCheck){
            navigation.replace('Home', {email: name});
        // Alert.alert('text submitted...', inputText);
    // }else{
    //   Alert.alert('incorrect email or password...');
    // }
// }else{
//       handleFocus1();
//       console.log('focus handled...');
// }
    }

const handleKeyPress = (e) => {
  // Check if the pressed key is the Enter key (key code 13);
  if (e.nativeEvent.key === 'Enter') {
    // Trigger the button press
    console.log('enter pressed...');
    handleButton();
  }
};

const handleFocus = () =>{

  focusRef.current && focusRef.current.focus();

}

const handleFocus1 = () =>{

  focusRef1.current && focusRef1.current.focus();

} 

const handleRefresh=()=>{
  fetchData();
  console.log(userData);
}

return(
        <View style={{flexDirection:'column', alignItems:'center', width:'100%', flex:1, justifyContent:'center'}}>
            <Text style={{fontSize:35, fontWeight:'600', color:theme.colors.blue}}>Login</Text>
            <TextInput
            ref={focusRef}
            style={{width:'90%', borderColor:'black', marginVertical:10, backgroundColor:'white', borderRadius:8, paddingLeft:'2%', backgroundColor:'lightgrey'}}
            placeholder="email"
            onChangeText={handleTextChange}
            onKeyPress={handleKeyPress}
            value={inputText}
            secureTextEntry={false}
            />
            <TextInput
            style={{width:'90%', borderColor:'black', marginVertical:10, backgroundColor:'white', borderRadius:8, paddingLeft:'2%', backgroundColor:'lightgrey'}}
            ref={focusRef1}
            placeholder="password"
            onChangeText={handlepass}
            value={inputPass}
            secureTextEntry={true} 
            onKeyPress={handleKeyPress}
            />
            <Pressable onPress={handleButton} style={{marginVertical:10, width:100, alignItems:'center', justifyContent:'center', borderColor:'black', borderRadius:8, height:40, backgroundColor:theme.colors.blue}}>
            <Text style={{fontSize:20, color:'white'}}>submit</Text>
            </Pressable>
            <Pressable onPress={()=>handleRefresh()}>
            <Text style={{textDecorationLine:'underline', color:'black'}}>Refresh</Text>
            </Pressable>
        </View>
    )
}