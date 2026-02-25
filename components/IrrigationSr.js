import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { BaseUrl } from "../assets/Data";
import theme from "../theme/GlobalTheme";
import DateItem from "../items/DateItem";

export default function IrrigationSr({ route }) {

  const email = route.params.email;


  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;


  const [implementData, setImplementData] = useState([]);
  const [length, setLength] = useState(0);
  const [name, setName] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [checkImp, setCheckImp] = useState([]);
  const [patch, setPatch] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [baseLng, setBaseLng] = useState(length);
  const [date1, setDate1] = useState('');
  const [lastTap, setLastTap] = useState(0);
  const [irId, setIrId] = useState('');


  const fetchImplements = async () => {
    try {
      const response = await fetch(`${BaseUrl}/irrigationsr/${email}`);
      const json = await response.json();
      setImplementData(json);
      console.log('json imp:', json);
      const lng = json[json.length - 1];
      let newLng = lng.id;
      setLength(newLng + 1);
      setBaseLng(newLng + 1);
    } catch (e) {
      console.log('error...', e);
    }
  }



  const handleSubmit = async () => {
    if (irId === '') {
      if (name !== '') {
        const checkData = implementData.find((item) => item.source === name && item.email === email);
        if (!checkData || checkData.length === 0) {
          const data = { id: length, email, source: name, date: date1 };
          await fetch(`${BaseUrl}/irrigationsr`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((json) => console.log(json))
            .then(() => { Alert.alert('successfully uploaded!!!') })
            .then(() => { handleClear() })
            .then(() => fetchImplements())
            .catch((error) => console.error(error));
        }
        else {
          setLength(checkData.id);
          Alert.alert('already exist!');
        }
      }
    } else {
      await handleUpdate();
    }
  };

  const handleUpdate = async () => {
    try {

      const data = { source: name, email, id: length };
      setUpdating(true);
      await fetch(`${BaseUrl}/irrigationsr/${irId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      Alert.alert('Successfully updated...');
      setUpdating(false);
      fetchImplements();
      setLength(baseLng);
      setName('');
      setIrId('');
    } catch (e) {
      console.log('Error: ' + e);
      setUpdating(false);
      setLength(baseLng);
      setName('');
    }
  };


  const handleDelete = async () => {
    try {
      setDeleting(true);
      if (irId === '') {
        Alert.alert('Select Source first');
        return;
      }

      setDeleting(true);
      setName('');

      await fetch(`${BaseUrl}/irrigationsr/${irId}`, {
        method: 'DELETE'
      });
      setDeleting(false);
      Alert.alert('Successfully deleted');
      fetchImplements();
      setName('');
    } catch (e) {
      console.log('Error: ' + e);
      setDeleting(false);
      setName('');
    } finally {
      setDeleting(false);
    }
  };


  const handleName = (text) => {
    setName(text);
    const lng = implementData[implementData.length - 1];
    let newLng = lng.id + 1;
    console.log('lng', newLng);
    if (text === '') {
      setLength(newLng);
    }
  }

  const hanldeLength = (text) => {
    setLength(text);
    const check = implementData.find((item) => item.id === parseInt(text));
    setCheckImp(check);
    if (!check || check.length === 0) {
      console.log('length running...', check);
      // setPatch(false);
      setName('');
    } else {
      console.log('found...', check.source);
      setName(check.source);
      // setPatch(true);
    }
  }

  const handleDate = (text) => {
    setDate1(text);
  }

  const handleClear = () => {
    setName('');
  }

  useEffect(() => {
    fetchImplements();
    setDate1(formattedDate);
  }, []);

  const handleDoubleClick = (data) => {
    console.log('id:', data._id);
    const now = Date.now();
    if (now - lastTap < 2000) {
      setLength(data.id);
      setIrId(data._id);
      setDate1(data.date);
      setName(data.source);
    }
    setLastTap(now);
  };



  return (
    <View style={{ flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%', alignItems: 'center', backgroundColor: 'white' }}>
      {deleting && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>deleting...</Text>
        </View>
      )}
      {updating && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>deleting...</Text>
        </View>
      )}
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'flex-start', marginLeft: '5%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%' }}>
          {/* <View style={{ flexDirection: 'column', width: '100%', marginLeft: '30%' }}>
            <Text style={{ fontWeight: 'bold', color: 'black' }}>Code</Text>
            <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', width: '60%', height: 40, borderRadius: 8 }}>
              <TextInput
                onChangeText={hanldeLength}
                value={length?.toString()}
                style={{
                  width: '100%',
                }}
              />
            </View>
          </View> */}
          <View style={{ alignSelf: 'flex-start', marginLeft: '5%', width: '70%' }}>
            <DateItem
              label="Entry Date"
              value={[date1]}
              onChange={setDate1}
            />
          </View>
          {/* <View style={{ flexDirection: 'column', width: '100%', marginLeft: '0%' }}>
            <Text style={{ fontWeight: 'bold', color: 'black' }}>Date</Text>
            <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', width: '70%', height: 40, borderRadius: 8 }}>
              <TextInput
                onChangeText={handleDate}
                value={date1}
                style={{
                  width: '100%'
                }}
              />
            </View>
          </View> */}
        </View>
        <View style={{ flexDirection: 'column', width: '70%', paddingTop: 20, marginLeft:'10%' }}>
          <Text style={{ fontWeight: 'bold', color: 'black' }}>Irrigation Source</Text>
          <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', height: 45, borderRadius: 8 }}>
            <TextInput
              style={{ width: '100%' }}
              onChangeText={handleName}
              value={name}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', paddingTop: 30, marginLeft: '5%' }}>
          <Pressable onPress={() => handleSubmit()} style={{ paddingTop: 30, }}>
            <Text style={{ height: 30, width: 80, borderWidth: 1, borderColor: 'black', textAlign: 'center', paddingTop: 3, borderRadius: 5, elevation: 5, backgroundColor: 'black', color: 'white', fontWeight: '400' }}>Save</Text>
          </Pressable>
          <Pressable onPress={() => handleDelete()} style={{ paddingTop: 30, }}>
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
              }}>Delete</Text>
          </Pressable>
          <Pressable onPress={() => {
            setDate1(formattedDate);
            setName('');
            setIrId('');
            hanldeLength();
          }} style={{ paddingTop: 30, }}>
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
              }}>New</Text>
          </Pressable>
        </View>
        <View style={styles.container2}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.column1}>
              <Text style={styles.heading}>Id</Text>
              <Text style={styles.heading}>Date</Text>
              <Text style={styles.heading}>Source</Text>
            </View>
            {implementData.map((item) => (
              <TouchableOpacity onPress={() => { handleDoubleClick(item) }} style={styles.column2} key={item._id}>
                <Text style={styles.text}>{item.id}</Text>
                <Text style={styles.text}>{item.date}</Text>
                <Text style={styles.text}>{item.source}</Text>
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
    textAlign: 'center',
  },
});