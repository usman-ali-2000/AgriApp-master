import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";

export default function Stages({route}){

    const email = route.params.email;

    
   const currentDate = new Date();

   const day = currentDate.getDate();
   const month = currentDate.getMonth() + 1;
   const year = currentDate.getFullYear();

   const formattedDate = `${day}/${month}/${year}`;


    const [stageData, setStageData] = useState([]);
    const [length, setLength] = useState(0);
    const [name, setName] = useState('');
    const [deleting, setDeleting]  = useState(false);
    const [checkImp, setCheckImp] = useState([]);
    const [patch, setPatch] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [baseLng, setBaseLng] = useState(length);
    const [date1, setDate1] = useState('');
    

    const fetchStage= async()=>{
    try{    const response = await fetch(`https://agri-api.vercel.app/stage/${email}`);
        const json = await response.json();
        setStageData(json);
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
        const checkData = stageData.find((item)=>item.name === name && item.email === email);
        if(!checkData || checkData.length === 0){
        const data = {id:length, email, name, date: date1};
          await fetch('https://agri-api.vercel.app/stage', {
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
            .then(()=>fetchStage())
            .catch((error) => console.error(error));
        }
        else
        {
            setLength(checkData.id); 
            Alert.alert('already exist!');
        }
      }
      fetchData(); 
        };

  const handleUpdate= async()=>{
try{
  
  if(patch){
    const data = { name, email, id:length };
    setUpdating(true);
    await fetch('https://agri-api.vercel.app/stage', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  Alert.alert('Successfully updated...');
  setUpdating(false);
  fetchStage();
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
      // const checkImp = stageData.find((item) => item.email === email && item.name === name);
      const data = { email, name, id:length };
      if (patch) {
        setDeleting(true);
        setName('');

        await fetch('https://agri-api.vercel.app/stage', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        setDeleting(false);
        Alert.alert('Successfully deleted');
        fetchStage();
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
    fetchData(); 
  };
 

        const handleName=(text)=>{
            setName(text);
        const lng = stageData[stageData.length-1];
        let newLng = lng.id+1;
        console.log('lng',newLng);
            if(text===''){
                setLength(newLng);
            } 
        }

        const hanldeLength=(text)=>{
             setLength(text);
            const check = stageData.find((item) => item.id === parseInt(text));
            setCheckImp(check);
            if (!check || check.length === 0) {
              console.log('length running...', check);
              setPatch(false);
              setName('');
            } else {
              console.log('found...', check.name);
              setName(check.name);
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
        fetchStage();
        setDate1(formattedDate);
    },[]);

    return(
        <View style={{flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%', alignItems: 'center'}}>
        <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', width:'20%'}}>
        <View style={{flexDirection:'column', width:'100%', marginLeft:50}}>
        <Text style={{fontWeight:'bold'}}>Code</Text>
        <View style={{flexDirection:'row', borderBottomWidth:1, backgroundColor:'white', width:'40%'}}>
        <TextInput
        onChangeText={hanldeLength}
        value={length.toString()}
        style={{
          width:'100%'
        }}
        />
        </View>
        </View>
        <View style={{flexDirection:'column', width:'100%', marginLeft:115}}>
        <Text style={{fontWeight:'bold'}}>Date</Text>
        <View style={{flexDirection:'row', borderBottomWidth:1, backgroundColor:'white', width:'70%'}}>
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
        <View style={{flexDirection:'column', width:'30%', paddingTop:20}}>
        <Text style={{fontWeight:'bold'}}>Stage</Text>
        <View style={{flexDirection:'row', borderBottomWidth:1, backgroundColor:'white'}}>
        <TextInput
        style={{width:'100%'}}
        onChangeText={handleName}
        value={name}
        />
        </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '40%', paddingTop: 30 }}>
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