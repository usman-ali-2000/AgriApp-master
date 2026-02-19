import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator, Alert } from "react-native";

export default function Farms({route}){

    const email = route.params.email;


    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
 
    const formattedDate = `${day}/${month}/${year}`;
 

    const focusRef = useRef(null);

    const [inputVehicle, setInputVehicle] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [userData, setUserData] = useState([]);
    const [date1, setDate1] = useState('');
  
    const fetchData = async () => {
      try {
        const response = await fetch('https://agri-api.vercel.app/vehicle');
        const json = await response.json();
        // console.log('json:', json);
        setUserData(json);
      } catch (error) {
        console.log('error in fetching');
      }
    };

    const handleTextChange=(text)=>{
    setInputVehicle(text);
    }

    const handleModal=()=>{
        setModalVisible(false);
    }
    
    const handleDate =(text)=>{
      setDate1(text);
    }

  const handleSubmit = async () => {
    const checkVehicle = userData.find(
      (item) => item.email === email && item.vehicle === inputVehicle
    );

    if (inputVehicle !== '' && checkVehicle === undefined) {
      setModalVisible(true);
      console.log('submit', inputVehicle);
      const data = { email, vehicle: inputVehicle, date: date1};
      await fetch('https://agri-api.vercel.app/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .then(() => handleModal())
        .catch((error) => console.error(error));
    }else{
      Alert.alert('already exist...');
    }
    setInputVehicle('');
    fetchData(); 
  };

  
  const handleDelete = async () => {
    try {
      const checkVehicle = userData.find(
        (item) => item.email === email && item.vehicle === inputVehicle
      );
      const data = { email, vehicle: inputVehicle };
      if (checkVehicle !== undefined) {
        setDeleting(true);
        setInputVehicle('');

        await fetch('https://agri-api.vercel.app/vehicle', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        setDeleting(false);
        Alert.alert('Successfully deleted');
        setInputVehicle('');
      } else {
        Alert.alert('not found...');
        setInputVehicle('');
      }
    } catch (e) {
      console.log('Error: ' + e);
      setDeleting(false);
      setInputVehicle('');
    }
    fetchData(); 
  };

  const handleAlert=()=>{
    if(inputVehicle !== ''){
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: async () => {
        setInputVehicle('');
        },
      },
      {
        text: 'Confirm',
        onPress: async () => {
               await handleDelete();
        },
      },
    ],
    { cancelable: true }
  );
}
}

    useEffect(()=>{
        fetchData();
        // console.log(userData);
        focusRef.current && focusRef.current.focus();
        setDate1(formattedDate);
    },[]);


    return(
        
    <View style={{flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%',alignItems: 'center'}}>
        <Text style={{ width: '40%', fontSize: 15, paddingLeft: 10 }}>Date</Text>
        <View style={{width:'40%'}}>
        <TextInput 
        ref={focusRef}
        style={{
          width: '50%',
          borderBottomWidth: 1,
          borderColor: 'black',
          marginVertical: 10,
          backgroundColor: 'white',
        }}
        onChangeText={handleDate}
        value={date1}
        secureTextEntry={false}
      />
      </View>
      <Text style={{ width: '40%', fontSize: 15, paddingLeft: 10 }}>Enter Vehicle</Text>
        <TextInput 
        ref={focusRef}
        style={{
          width: '40%',
          borderBottomWidth: 1,
          borderColor: 'black',
          marginVertical: 10,
          backgroundColor: 'white',
        }}
        placeholder="Enter Vehicle"
        onChangeText={handleTextChange}
        value={inputVehicle}
        secureTextEntry={false}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '30%', paddingTop: 30 }}>
      <Pressable onPress={handleSubmit}>
      <Text
            style={{
              height: 30,
              width: 80,
              borderWidth: 1,
              borderColor: 'black',
              textAlign: 'center',
              paddingTop: 3,
              borderRadius: 5,
              elevation: 5,
              backgroundColor: 'black',
              color: 'white',
            }}>
            Save
          </Text>
          </Pressable>
          <Pressable onPress={handleAlert}>
          <Text
            style={{
              height: 30,
              width: 80,
              borderWidth: 1,
              borderColor: 'red',
              textAlign: 'center',
              paddingTop: 3,
              borderRadius: 5,
              elevation: 5,
              backgroundColor: 'red',
              color: 'white',
            }}>
            Delete
          </Text>
          </Pressable>
        </View>      
        {isModalVisible && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Uploading...</Text>
        </View>
      )}
      {deleting && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>deleting...</Text>
        </View>
      )}
        </View>
    )
}