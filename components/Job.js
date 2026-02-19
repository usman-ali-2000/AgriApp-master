import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator, Alert } from "react-native";

export default function Job({route}){

    const email = route.params.email;


    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
 
    const formattedDate = `${day}/${month}/${year}`;
 

    const focusRef = useRef(null);

    const [inputJob, setInputJob] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [userData, setUserData] = useState([]);
    const [date1, setDate1] = useState('');
  
    const fetchData = async () => {
      try {
        const response = await fetch(`https://agri-api.vercel.app/job/${email}`);
        const json = await response.json();
        // console.log('json:', json);
        setUserData(json);
      } catch (error) {
        console.log('error in fetching');
      }
    };

    const handleTextChange=(text)=>{
    setInputJob(text);
    }

    const handleModal=()=>{
        setModalVisible(false);
    }
    
    const handleDate =(text)=>{
      setDate1(text);
    }

  const handleSubmit = async () => {
    const checkJob = userData.find((item) => item.job === inputJob);

    if (inputJob !== '' && checkJob === undefined) {
      setModalVisible(true);
      console.log('submit', inputJob);
      const data = { email, job: inputJob, date: date1 };
      await fetch('https://agri-api.vercel.app/job', {
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
    setInputJob('');
    fetchData();
  };

  
  const handleDelete = async () => {
    try {
      const checkJob = userData.find(
        (item) => item.job === inputJob);
      const data = { email, job: inputJob };
      if (checkJob !== undefined) {
        setDeleting(true);
        setInputJob('');

        await fetch('https://agri-api.vercel.app/job', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        setDeleting(false);
        Alert.alert('Successfully deleted');
        setInputJob('');
    } else {
        Alert.alert('not found...');
        setInputJob('');
      }
    } catch (e) {
      console.log('Error: ' + e);
      setDeleting(false);
      setInputJob('');
    }
    fetchData(); 
  };

  const handleAlert=()=>{
    if(inputJob !== ''){
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: async () => {
        setInputJob('');
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
        focusRef.current && focusRef.current.focus();
        setDate1(formattedDate);
    },[]);


    return(
        
    <View style={{flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%',alignItems: 'center', backgroundColor:'white'}}>
        <Text style={{ width: '30%', fontSize: 15, color:'black', marginRight:'40%' }}>Date</Text>
        <View style={{width:'30%', height:40, backgroundColor:'lightgrey',  borderRadius:8, marginRight:'40%'}}>
        <TextInput 
        ref={focusRef}
        style={{
          width: '100%',
          height:40,
        }}
        onChangeText={handleDate}
        value={date1}
        secureTextEntry={false}
      />
      </View>
      <Text style={{ width: '70%', fontSize: 15, color:'black', marginTop:'5%' }}>Enter Job</Text>
        <TextInput 
        ref={focusRef}
        style={{
          width: '70%',
          borderRadius:8,
          height:40,
          backgroundColor: 'lightgrey',
        }}
        placeholder="Enter Job"
        onChangeText={handleTextChange}
        value={inputJob}
        secureTextEntry={false}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '50%', paddingTop: 30 }}>
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