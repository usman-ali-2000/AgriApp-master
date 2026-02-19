import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator, Alert } from "react-native";

export default function Category({route}){

   const currentDate = new Date();

   const day = currentDate.getDate();
   const month = currentDate.getMonth() + 1;
   const year = currentDate.getFullYear();

   const formattedDate = `${day}/${month}/${year}`;

    const email = route.params.email;


    const focusRef = useRef(null);

    const [inputCategory, setInputCategory] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [userData, setUserData] = useState([]);
    const [date1, setDate1] = useState('');
  
    const fetchData = async () => {
      try {
        const response = await fetch('https://agri-api.vercel.app/category');
        const json = await response.json();
        // console.log('json:', json);
        setUserData(json);
      } catch (error) {
        console.log('error in fetching');
      }
    };

    const handleTextChange=(text)=>{
    setInputCategory(text);
    }

    const handleModal=()=>{
        setModalVisible(false);
    }
    
    const handleDate =(text)=>{
      setDate1(text);
    }

  const handleSubmit = async () => {
    const checkCategory = userData.find(
      (item) => item.email === email && item.category === inputCategory
    );

    if (inputCategory !== '' && checkCategory === undefined) {
      setModalVisible(true);
      console.log('submit', inputCategory);
      const data = { email, category: inputCategory, date: formattedDate };
      await fetch('https://agri-api.vercel.app/category', {
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
    setInputCategory('');
    fetchData(); 
  };

  
  const handleDelete = async () => {
    try {
        fetchData();
      const checkCategory = userData.find(
        (item) => item.email === email && item.category === inputCategory
      );
      const data = { email, category: inputCategory };
      if (checkCategory !== undefined) {
        setDeleting(true);
        setInputCategory('');

        await fetch('https://agri-api.vercel.app/category', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        setDeleting(false);
        Alert.alert('Successfully deleted');
        setInputCategory('');
      } else {
        Alert.alert('not found...');
        setInputCategory('');
      }
    } catch (e) {
      console.log('Error: ' + e);
      setDeleting(false);
      setInputCategory('');
    }
    fetchData();
  };

  const handleAlert=()=>{
    if(inputCategory !== ''){
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: async () => {
        setInputCategory('');
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
        // console.log(formattedDate);
        focusRef.current && focusRef.current.focus();
        setDate1(formattedDate);
    },[]);


    return(
        
    <View style={{flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%',alignItems: 'center', backgroundColor:'white'}}>
<Text style={{ width: '50%', fontSize: 15, color:'black', marginRight:'20%'}}>Date</Text>
        <View style={{width:'50%', marginRight:'20%'}}>
        <TextInput 
        ref={focusRef}
        style={{
          width: '50%',
          height:40,
          backgroundColor:'lightgrey',
          marginVertical: 10,
          borderRadius:8,
          paddingLeft:'5%'
        }}
        onChangeText={handleDate}
        value={date1}
        secureTextEntry={false}
      />
      </View>
        <Text style={{ width: '70%', fontSize: 15, color:'black' }}>Enter Category</Text>
        <TextInput 
        ref={focusRef}
        style={{
          width: '70%',
          borderRadius:8,
          marginVertical: 10,
          backgroundColor: 'lightgrey',
          paddingLeft:'5%'
        }}
        placeholder="Enter Category"
        onChangeText={handleTextChange}
        value={inputCategory}
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