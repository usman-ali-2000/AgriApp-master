import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";

export default function IrrigationSr({route}){

    const email = route.params.email;

    
   const currentDate = new Date();

   const day = currentDate.getDate();
   const month = currentDate.getMonth() + 1;
   const year = currentDate.getFullYear();

   const formattedDate = `${day}/${month}/${year}`;


    const [implementData, setImplementData] = useState([]);
    const [length, setLength] = useState(0);
    const [name, setName] = useState('');
    const [deleting, setDeleting]  = useState(false);
    const [checkImp, setCheckImp] = useState([]);
    const [patch, setPatch] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [baseLng, setBaseLng] = useState(length);
    const [date1, setDate1] = useState('');
    

    const fetchImplements= async()=>{
    try{    const response = await fetch(`https://agri-api.vercel.app/irrigationsr/${email}`);
        const json = await response.json();
        setImplementData(json);
        console.log('json imp:', json);
        const lng = json[json.length-1];
        let newLng = lng.id;
        setLength(newLng+1);
        setBaseLng(newLng+1);
    }catch(e){
      console.log('error...',e);
    }
  }



    const handleSubmit = async () => {
      if(name !== ''){
        const checkData = implementData.find((item)=>item.source === name && item.email === email);
        if(!checkData || checkData.length === 0){
        const data = {id:length, email, source: name, date: date1};
          await fetch('https://agri-api.vercel.app/irrigationsr', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((json) => console.log(json))
            .then(() => {Alert.alert('successfully uploaded!!!')})
            .then(()=>{handleClear()})
            .then(()=>fetchImplements())
            .catch((error) => console.error(error));
        }
        else
        {
            setLength(checkData.id); 
            Alert.alert('already exist!');
        }
      }
        };

  const handleUpdate= async()=>{
try{
  
  if(patch){
    const data = { source: name, email, id:length };
    setUpdating(true);
    await fetch('https://agri-api.vercel.app/irrigationsr', {
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
} else {
  Alert.alert('not found...');
  setUpdating(false);
  setLength(baseLng)
  setName('');
}
} catch (e) {
console.log('Error: ' + e);
setUpdating(false);
setLength(baseLng);
setName('');
}
};

        
  const handleDelete = async () => {
    try {
      // const checkImp = implementData.find((item) => item.email === email && item.name === name);
      const data = { email, source: name, id:length };
      if (patch) {
        setDeleting(true);
        setName('');

        await fetch('https://agri-api.vercel.app/irrigationsr', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        setDeleting(false);
        Alert.alert('Successfully deleted');
        fetchImplements();
        setName('');
      } else {
        Alert.alert('not found...');
        setName('');
      }
    } catch (e) {
      console.log('Error: ' + e);
      setDeleting(false);
      setName('');
    }
  };
 

        const handleName=(text)=>{
            setName(text);
        const lng = implementData[implementData.length-1];
        let newLng = lng.id+1;
        console.log('lng', newLng);
            if(text===''){
                setLength(newLng);
            } 
        }

        const hanldeLength=(text)=>{
             setLength(text);
            const check = implementData.find((item) => item.id === parseInt(text));
            setCheckImp(check);
            if (!check || check.length === 0) {
              console.log('length running...', check);
              setPatch(false);
              setName('');
            } else {
              console.log('found...', check.source);
              setName(check.source);
              setPatch(true);
            }
      }

      const handleDate=(text)=>{
        setDate1(text);
      }

        const handleClear=()=>{
            setName('');
        }

    useEffect(()=>{
        fetchImplements();
        setDate1(formattedDate);
    },[]);

    return(
        <View style={{flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%', alignItems: 'center', backgroundColor:'white'}}>
        <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', width:'50%'}}>
        <View style={{flexDirection:'column', width:'100%', marginLeft:'30%'}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Code</Text>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', width:'60%', height:40, borderRadius:8}}>
        <TextInput
        onChangeText={hanldeLength}
        value={length.toString()}
        style={{
          width:'100%',
        }}
        />
        </View>
        </View>
        <View style={{flexDirection:'column', width:'100%', marginLeft:115}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Date</Text>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', width:'70%', height:40, borderRadius:8}}>
        <TextInput
        onChangeText={handleDate}
        value={date1}
        style={{
          width:'100%'
        }}
        />
        </View>
        </View>
        </View>
        <View style={{flexDirection:'column', width:'70%', paddingTop:20}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Irrigation Source</Text>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', height:45, borderRadius:8}}>
        <TextInput
        style={{width:'100%'}}
        onChangeText={handleName}
        value={name}
        />
        </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', paddingTop: 30 }}>
        <Pressable onPress={()=>handleSubmit()} style={{paddingTop:30, }}>
        <Text style={{height:30, width:80, borderWidth:1, borderColor:'black', textAlign:'center', paddingTop:3, borderRadius:5, elevation:5, backgroundColor:'black', color:'white', fontWeight:'400'}}>Save</Text>
        </Pressable>
        <Pressable onPress={()=>handleUpdate()} style={{paddingTop:30, }}>
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
                   }}>Update</Text>
        </Pressable>
    
        <Pressable onPress={()=>handleDelete()} style={{paddingTop:30, }}>
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
        </View>
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
        </View>
    )
}