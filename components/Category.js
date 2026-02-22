import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { BaseUrl } from "../assets/Data";
import theme from "../theme/GlobalTheme";

export default function Category({ route }) {

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
  const [lastTap, setLastTap] = useState(0);
  const [catId, setCatId] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch(`${BaseUrl}/category`);
      const json = await response.json();
      // console.log('json:', json);
      setUserData(json);
    } catch (error) {
      console.log('error in fetching');
    }
  };

  const handleTextChange = (text) => {
    setInputCategory(text);
  }

  const handleModal = () => {
    setModalVisible(false);
  }

  const handleDate = (text) => {
    setDate1(text);
  }

  async function updateCategory() {
    try {
      const res = await fetch(`${BaseUrl}/category/${catId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, category: inputCategory, date: date1 }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to update category");
      }

      const data = await res.json();
      console.log("Updated category:", data);
      Alert.alert('category updated...');
      if (res.ok) {
        setCatId('');
      }
      return data;
    } catch (err) {
      console.error("Update failed:", err);
      throw err;
    }
  }

  const handleSubmit = async () => {
    if (catId === '') {
      const checkCategory = userData.find(
        (item) => item.email === email && item.category === inputCategory
      );
      if (inputCategory !== '' && checkCategory === undefined) {
        setModalVisible(true);
        console.log('submit', inputCategory);
        const data = { email, category: inputCategory, date: formattedDate };
        await fetch(`${BaseUrl}/category`, {
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
      } else {
        Alert.alert('already exist...');
      }
    } else {
      await updateCategory();
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

        await fetch(`${BaseUrl}/category/${catId}`, {
          method: 'DELETE'
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

  const handleAlert = () => {
    if (inputCategory !== '') {
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

  useEffect(() => {
    fetchData();
    // console.log(formattedDate);
    focusRef.current && focusRef.current.focus();
    setDate1(formattedDate);
  }, []);


  const handleDoubleClick = (data) => {
    console.log('id:', data._id);
    const now = Date.now();
    if (now - lastTap < 2000) {
      setInputCategory(data.category);
      setCatId(data._id);
      setDate1(data.date);
    }
    setLastTap(now);
  };


  return (

    <View style={{ flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%', alignItems: 'center', backgroundColor: 'white' }}>
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
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
        <Text style={{ width: '50%', fontSize: 15, color: 'black', marginRight: '20%' }}>Date</Text>
        <View style={{ width: '50%', marginRight: '20%' }}>
          <TextInput
            ref={focusRef}
            style={{
              width: '50%',
              height: 40,
              backgroundColor: 'lightgrey',
              marginVertical: 10,
              borderRadius: 8,
              paddingLeft: '5%'
            }}
            onChangeText={handleDate}
            value={date1}
            secureTextEntry={false}
          />
        </View>
        <Text style={{ width: '70%', fontSize: 15, color: 'black' }}>Enter Category</Text>
        <TextInput
          ref={focusRef}
          style={{
            width: '70%',
            borderRadius: 8,
            marginVertical: 10,
            backgroundColor: 'lightgrey',
            paddingLeft: '5%'
          }}
          placeholder="Enter Category"
          onChangeText={handleTextChange}
          value={inputCategory}
          secureTextEntry={false}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%', paddingTop: 30 }}>
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
          <Pressable onPress={() => {
            setDate1(formattedDate);
            setCatId('');
            setInputCategory('');
          }}>
            <Text
              style={{
                height: 30,
                width: 80,
                borderWidth: 1,
                borderColor: 'green',
                textAlign: 'center',
                paddingTop: 3,
                borderRadius: 5,
                elevation: 5,
                backgroundColor: 'green',
                color: 'white',
              }}>
              New
            </Text>
          </Pressable>
        </View>
        <View style={styles.container2}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.column1}>
              <Text style={styles.heading}>Date</Text>
              <Text style={styles.heading}>Category</Text>
            </View>
            {userData.map((item) => (
              <TouchableOpacity onPress={() => { handleDoubleClick(item) }} style={styles.column2} key={item._id}>
                <Text style={styles.text}>{item.date}</Text>
                <Text style={styles.text}>{item.category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  container2: {
    flexDirection: 'row',
    // width: '95%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: '5%',
    marginLeft: '2.5%',
    backgroundColor: 'white',
    marginBottom: '1%',
    elevation: 5,
  },
  column1: {
    flexDirection: 'row',
    padding: '1%',
    backgroundColor: theme.colors.blue,
  },
  column2: {
    flexDirection: 'row',
    // padding: '1%',
    backgroundColor: theme.colors.white,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
    padding: 5,
    width: 100,
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    width: 100,
    padding: 5,
    borderWidth: 1 / 2,
    textAlign: 'center'
  },
});