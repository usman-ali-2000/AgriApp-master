import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Plot({route}){

    const email = route.params.email;
    
   const currentDate = new Date();

   const day = currentDate.getDate();
   const month = currentDate.getMonth() + 1;
   const year = currentDate.getFullYear();

   const formattedDate = `${day}/${month}/${year}`;



    const [userData, setUserData] = useState([]);
    const [openFarm, setOpenFarm] = useState(false);
    const [farmData, setFarmData] = useState('');
    const [openSeason, setOpenSeason] = useState(false);
    const [seasonData, setSeasonData] = useState('');
    const [varietyData, setVarietyData] = useState([]);
    const [openVariety, setOpenVariety] = useState(false);
    const [varietyInfo, setVarietyInfo] = useState('');
    const [block, setBlock] = useState('');
    const [plot, setPlot] = useState('');
    const [area, setArea] = useState('');
    const [rowSpace, setRowSpace] = useState('');
    const [plotData, setPlotData] = useState([]);
    const [date1, setDate1] = useState('');


    const handleBlock = (text) => {
        setBlock(text);
    }

    const handlePlot =(text)=>{
        setPlot(text);
    }

    
    const handleArea =(text)=>{
        setArea(text);
    }

    
    const handleRowSpace =(text)=>{
        setRowSpace(text);
    }

    const handleDate=(text)=>{
        setDate1(text);
    }

    const data =[
        {   id:1,
            season: 'new'
        },
        {
            id:2,
            season: '1'
        },
        {
            id:3,
            season: '2'
        },
        {
            id:4,
            season: '3'
        },
        {
            id:5,
            season: '4'
        }
    ]

    const fetchPlot= async()=>{
        const response = await fetch(`https://agri-api.vercel.app/plot/${email}`);
        const json = await response.json();
        setPlotData(json);
        console.log('plot:', json);

    }

    const handleOk =()=>{
        setFarmData('');
        setBlock('');
        setPlot('');
        setArea('');
        setSeasonData('');
        setRowSpace('');
        setVarietyInfo('');
    }

    const handleSubmit = async () => {
        await fetchPlot();
        const checkPlot = plotData.some((item) => {
            return (
                item.email === email &&
                item.plot === plot &&
                item.block === block &&
                item.farm === farmData
            );
        });
        if(!checkPlot){
        const data = {farm: farmData, block, plot, area, season: seasonData, rowspace: rowSpace, variety: varietyInfo, email, date: formattedDate};
          await fetch('https://agri-api.vercel.app/plot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((json) => console.log(json))
            .then(() => {Alert.alert('successfully uploaded!!!')})
            .catch((error) => console.error(error));
        }else{
            handleUpdate();
        }
        fetchPlot();
        handleOk();
        };


        const handleUpdate = async()=>{
        
    const data = {farm: farmData, block, plot, area, season: seasonData, rowspace: rowSpace, variety: varietyInfo, email};
    await fetch('https://agri-api.vercel.app/plot', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .then(()=>{Alert.alert('successfully updated...')})
        .catch((error) => console.error(error));
    }
                

    const fetchVariety= async()=>{
        const response = await fetch(`https://agri-api.vercel.app/variety/${email}`);
        const json = await response.json();
        setVarietyData(json);
    }

    const fetchFarm = async()=>{
              const response = await fetch(`https://agri-api.vercel.app/farm/${email}`);
              const json = await response.json();
              setUserData(json);
            }

            const handleFarm=()=>{
                if(openFarm){
                    setOpenFarm(false);
                }else{
                    setOpenFarm(true);
                }
            }

            const handleSeason =()=>{
                if(openSeason){
                    setOpenSeason(false);
                }else{
                    setOpenSeason(true);
                }
            }

            const handleVariety =()=>{
                if(openVariety){
                    setOpenVariety(false);
                }else{
                    setOpenVariety(true);
                }
            }

            
            const variety =()=>{
                return(
                    <ScrollView>
                        <FlatList
                        data={varietyData}
                        keyExtractor={(item)=> item.id}
                        renderItem={({item}) =>{ 
                        return(
                            <TouchableOpacity onPress={()=>{setVarietyInfo(item.variety); setOpenVariety(false);}}>
                            <View style={{width:'100%', height:25, backgroundColor:'white'}}>
                                <Text style={{width:'100%', color:'black'}}>{item.variety}</Text>
                            </View>
                            </TouchableOpacity>
                        );
                    }
                }
                        />
                    </ScrollView>
                )
            }

            const farm =()=>{
                return(
                    <ScrollView>
                        <FlatList
                        data={userData}
                        keyExtractor={(item)=> item.id}
                        renderItem={({item}) =>{ 
                        return(
                            <TouchableOpacity onPress={()=>{setFarmData(item.farm); setOpenFarm(false);}}>
                            <View style={{width:'100%', height:25, backgroundColor:'white'}}>
                                <Text style={{width:'100%', color:'black'}}>{item.farm}</Text>
                            </View>
                            </TouchableOpacity>
                        );
                    }
                }
                        />
                    </ScrollView>
                )
            }

           const season=()=>{
            return(
                <ScrollView>
                    <FlatList
                    data={data}
                    keyExtractor={(item)=> item.id.toString()}
                    renderItem={({item}) =>{ 
                    return(
                        <TouchableOpacity onPress={()=>{setSeasonData(item.season); setOpenSeason(false)}}>
                        <View style={{width:'100%', height:25, backgroundColor:'white'}}>
                            <Text style={{width:'100%', color:'black'}}>{item.season}</Text>
                        </View>
                        </TouchableOpacity>
                    );
                }
            }
                    />
                </ScrollView>
            )
           }


    useEffect(()=>{
        fetchFarm();
        fetchPlot();
        fetchVariety();
        console.log('json:', varietyData);
        setDate1(formattedDate);
    },[]
    );

    return(
        <ScrollView style={{width:'100%', flex:1, backgroundColor:'white'}} contentContainerStyle={{justifyContent:'center', flex:1, alignItems:'center'}} showsVerticalScrollIndicator={false}>
        <View style={{flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%',alignItems: 'center', backgroundColor:'white'}}>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', paddingTop:10}}>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', width:'40%'}}>
        <View style={{flexDirection:'column', width:'100%', paddingRight:5, paddingTop:5}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Farm</Text>
        <Pressable onPress={()=>handleFarm()}>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', height:40, borderRadius:8}}>
        <Text
        style={{width:'80%', alignItems:'center', verticalAlign:'middle', color:'black', paddingLeft:'5%'}}
        >{farmData}</Text>
        <Image source={require('../assets/down.png')} style={{height:15, width:15, alignSelf:'center', marginTop:10, marginLeft:5, borderWidth: openFarm? 1:0, padding:5}}/>
        </View>
        </Pressable>
        {openFarm?<View style={{ height:80}}>{farm()}</View>:''}
        </View>
        </View>
        <View style={{flexDirection:'column', width:'38%', marginLeft:'2%'}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Date</Text>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', height:40, borderRadius:8}}>
        <TextInput
        style={{
            width:'100%',
        }}
        onChangeText = {handleDate}
        value={date1}
        />
        </View>
        </View>
        </View>
       <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', paddingTop:10}}>
        <View style={{flexDirection:'column', width:'40%'}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Block</Text>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', borderRadius:8, height:40}}>
        <TextInput
        style={{width:'100%'}}
        onChangeText={handleBlock}
        value={block}
        />
        </View>
        </View>
        <View style={{flexDirection:'column', width:'40%', paddingLeft:10}}>
        <View style={{flexDirection:'column'}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Plot</Text>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', borderRadius:8, height:40}}>
        <TextInput
        style={{width:'100%'}}
        onChangeText={handlePlot}
        value={plot}
        />
        </View>
        </View>
        </View>
        </View>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', paddingTop:10}}>
        <View style={{flexDirection:'column', width:'40%'}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Area</Text>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', borderRadius:8, height:40}}>
        <TextInput
        style={{width:'100%'}}
        onChangeText={handleArea}
        value={area}
        />
        </View>
        </View>
        <View style={{flexDirection:'column', width:'40%', paddingLeft:10}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Crop Season</Text>
        <Pressable onPress={()=>handleSeason()}>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', borderRadius:8, height:40}}>
        <Text
        style={{width:'80%', verticalAlign:'middle', color:'black', paddingLeft:'5%'}}
        >{seasonData}</Text>
        <Image source={require('../assets/down.png')} style={{height:15, width:15, alignSelf:'center', marginTop:10, marginLeft:5, borderWidth: openSeason ? 1:0, padding:5}}/>
        </View>
        </Pressable>
        {openSeason?<View style={{ height:80}}>{season()}</View>:''}
        </View>
        </View>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', paddingTop:10}}>
        <View style={{flexDirection:'column', width:'40%'}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Row Space</Text>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', borderRadius:8, height:40}}>
        <TextInput
        style={{width:'100%'}}
        onChangeText={handleRowSpace}
        value={rowSpace}
        />
        </View>
        </View>
        <View style={{flexDirection:'column', width:'40%', paddingLeft:10}}>
        <View style={{flexDirection:'column', width:'100%'}}>
        <Text style={{fontWeight:'bold', color:'black'}}>Variety</Text>
        <Pressable onPress={()=>{handleVariety()}}>
        <View style={{flexDirection:'row', backgroundColor:'lightgrey', borderRadius:8, height:40}}>
        <Text
        style={{width:'80%', verticalAlign:'middle', color:'black', paddingLeft:'5%'}}
        >{varietyInfo}</Text>
        <Image source={require('../assets/down.png')} style={{height:15, width:15, alignSelf:'center', marginTop:10, marginLeft:5, borderWidth: openVariety? 1:0, padding:5}}/>
        </View>
        </Pressable>
        {openVariety?<View style={{height:80}}>{variety()}</View>:''}
        </View>
        </View>
        </View>
        <Pressable onPress={()=>{handleSubmit()}} style={{paddingTop:50}}>
        <Text style={{height:30, width:80, borderWidth:1, borderColor:'black', textAlign:'center', paddingTop:3, borderRadius:5, elevation:5, backgroundColor:'black', color:'white', fontWeight:'400'}}>Ok</Text>
        </Pressable>
        </View>
        </ScrollView>
    )
}