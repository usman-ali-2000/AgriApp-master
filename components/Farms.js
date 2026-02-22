import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator, Alert, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { BaseUrl } from "../assets/Data";
import theme from "../theme/GlobalTheme";

export default function Farms({ route }) {

  const email = route.params.email;


  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;


  const focusRef = useRef(null);

  const [inputFarm, setInputFarm] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userData, setUserData] = useState([]);
  const [date1, setDate1] = useState('');
  const [lastTap, setLastTap] = useState(0);
  const [farmId, setFarmId] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch(`${BaseUrl}/farm`);
      const json = await response.json();
      console.log('json:', json);
      setUserData(json);
    } catch (error) {
      console.log('error in fetching...');
    }
  };

  const handleTextChange = (text) => {
    setInputFarm(text);
  }

  const handleModal = () => {
    setModalVisible(false);
  }

  const handleDate = (text) => {
    setDate1(text);
  }

  const handleDoubleClick = (data) => {
    console.log('id:', data._id);
    const now = Date.now();
    if (now - lastTap < 2000) {
      setInputFarm(data.farm);
      setFarmId(data._id);
      setDate1(data.date);
    }
    setLastTap(now);
  };

  const handleSubmit = async () => {
    const checkFarm = await userData.find((item) => item.email === email && item.farm === inputFarm);

    if (farmId === '') {
      if (inputFarm !== '' && checkFarm === undefined) {
        setModalVisible(true);
        console.log('submit', inputFarm);
        const data = { email, farm: inputFarm, date: date1 };
        await fetch(`${BaseUrl}/farm`, {
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
      updateFarm();
    }
    setInputFarm('');
    fetchData();
  };


  const handleDelete = async () => {
    if (deleting) return;

    if (!farmId) {
      Alert.alert("No farm selected to delete");
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`${BaseUrl}/farm/${farmId}`, {
        method: "DELETE"
      });

      // await res.text(); 
      setDeleting(false);

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      Alert.alert("Farm deleted");
      setFarmId('');
      setInputFarm('');
      await fetchData();

    } catch (err) {
      console.error("Delete failed:", err);
      Alert.alert("Delete failed");
    } finally {
      setDeleting(false);
    }
  };



  useEffect(() => {
    console.log("DELETING STATE:", deleting);
  }, [deleting]);

  async function updateFarm() {
    try {
      const res = await fetch(`${BaseUrl}/farm/${farmId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, farm: inputFarm, date: date1 }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to update farm");
      }

      const data = await res.json();
      console.log("Updated farm:", data);
      Alert.alert('farm updated...');
      if (res.ok) {
        setFarmId('');
      }
      return data;
    } catch (err) {
      console.error("Update failed:", err);
      throw err;
    }
  }


  const handleAlert = () => {
    if (inputFarm !== '') {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: async () => {
              setInputFarm('');
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
    // console.log(userData);
    focusRef.current && focusRef.current.focus();
    setDate1(formattedDate);
  }, []);


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
        <Text style={{ width: '50%', fontSize: 15, color: 'black', marginRight: '20%', }}>Date</Text>
        <View style={{ width: '50%', marginRight: '20%' }}>
          <TextInput
            ref={focusRef}
            style={{
              color: 'black',
              width: '50%',
              borderColor: 'black',
              backgroundColor: 'lightgrey',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onChangeText={handleDate}
            value={date1}
            secureTextEntry={false}
          />
        </View>
        <Text style={{ width: '70%', fontSize: 15, color: 'black' }}>Enter Farm</Text>
        <TextInput
          ref={focusRef}
          style={{
            color: 'black',
            width: '70%',
            backgroundColor: 'lightgrey',
            marginVertical: 10,
            borderRadius: 8
          }}
          placeholder="Enter Farm"
          onChangeText={handleTextChange}
          value={inputFarm}
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
            setFarmId('');
            setInputFarm('');
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
              <Text style={styles.heading}>Farm</Text>
            </View>
            {userData.map((item) => (
              <TouchableOpacity onPress={() => { handleDoubleClick(item) }} style={styles.column2} key={item._id}>
                <Text style={styles.text}>{item.date}</Text>
                <Text style={styles.text}>{item.farm}</Text>
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
