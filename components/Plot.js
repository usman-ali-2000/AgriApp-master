import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BaseUrl } from "../assets/Data";
import theme from "../theme/GlobalTheme";
import DateItem from "../items/DateItem";

export default function Plot({ route }) {

    const email = route.params.email;

    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const [userData, setUserData] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [openFarm, setOpenFarm] = useState(false);
    const [farmData, setFarmData] = useState('');
    const [farms, setFarms] = useState([]);
    const [farmId, setFarmId] = useState('');
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
    const [lastTap, setLastTap] = useState(0);
    const [plotId, setPlotId] = useState('');


    const handleBlock = (text) => {
        setBlock(text);
    }

    const handlePlot = (text) => {
        setPlot(text);
    }


    const handleArea = (text) => {
        setArea(text);
    }


    const handleRowSpace = (text) => {
        setRowSpace(text);
    }

    const handleDate = (text) => {
        setDate1(text);
    }

    const data = [
        {
            id: 1,
            season: 'new'
        },
        {
            id: 2,
            season: '1'
        },
        {
            id: 3,
            season: '2'
        },
        {
            id: 4,
            season: '3'
        },
        {
            id: 5,
            season: '4'
        }
    ]

    const fetchPlot = async () => {
        const response = await fetch(`${BaseUrl}/plot`);
        const json = await response.json();
        setPlotData(json);
        console.log('plot:', json);

    }

    const handleOk = () => {
        setFarmData('');
        setFarmId('');
        setBlock('');
        setPlot('');
        setArea('');
        setSeasonData('');
        setRowSpace('');
        setVarietyInfo('');
    }

    const handleSubmit = async () => {
        // await fetchPlot();
        setModalVisible(true);
        const checkPlot = plotData.find((item) =>
        (
            item.email === email &&
            item.plot === plot &&
            item.block === block &&
            item.farm === farmId
        )
        );
        if (farmId === '') {
            try {
                const plotData = { farm: farmId, block, plot, area, season: seasonData, rowspace: rowSpace, variety: varietyInfo, email, date: formattedDate };
                const response = await fetch(`${BaseUrl}/plot`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(plotData),
                });

                const text = await response.text();
                console.log("Server response:", text);
                // const data = await response.json();

                if (!response) {
                    Alert.alert(data.message || "Something went wrong");
                } else {
                    Alert.alert(`Plot added successfully!`);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            handleUpdate();
        }
        await fetchPlot();
        handleOk();
        setModalVisible(false);
    };


    const handleUpdate = async () => {
        setModalVisible(true);
        const data = { farm: farmId, block, plot, area, season: seasonData, rowspace: rowSpace, variety: varietyInfo, email };
        await fetch(`${BaseUrl}/plot/${plotId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((json) => console.log(json))
            .then(() => { Alert.alert('successfully updated...') })
            .catch((error) => console.error(error));
        setModalVisible(false);
    }


    const fetchVariety = async () => {
        const response = await fetch(`${BaseUrl}/variety/${email}`);
        const json = await response.json();
        setVarietyData(json);
    }

    const fetchFarm = async () => {
        const response = await fetch(`${BaseUrl}/farm`);
        const json = await response.json();
        setUserData(json);
    }

    const getFarm = async (id) => {
        try {
            const response = await fetch(`${BaseUrl}/farm/${id}`);
            const json = await response.json();
            return json.farm;
        } catch (error) {
            console.log('Error fetching farm data:', error);
        }
        return null;
    };

    useEffect(() => {
        const fetchFarms = async () => {
            const farms = {};
            for (const item of plotData) {
                if (!farms[item.farm]) {
                    farms[item.farm] = await getFarm(item.farm);
                }
            }
            setFarms(farms);
        };
        if (plotData.length > 0) {
            fetchFarms();
        }
    }, [plotData]);

    const handleFarm = () => {
        if (openFarm) {
            setOpenFarm(false);
        } else {
            setOpenFarm(true);
        }
    }

    const handleSeason = () => {
        if (openSeason) {
            setOpenSeason(false);
        } else {
            setOpenSeason(true);
        }
    }

    const handleVariety = () => {
        if (openVariety) {
            setOpenVariety(false);
        } else {
            setOpenVariety(true);
        }
    }


    const variety = () => {
        return (
            <ScrollView>
                <FlatList
                    data={varietyData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => { setVarietyInfo(item.variety); setOpenVariety(false); }}>
                                <View style={{ width: '100%', height: 25, backgroundColor: 'white' }}>
                                    <Text style={{ width: '100%', color: 'black' }}>{item.variety}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    }
                />
            </ScrollView>
        )
    }

    const farm = () => {
        return (
            <ScrollView>
                <FlatList
                    data={userData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => { setFarmData(item.farm); setFarmId(item._id); setOpenFarm(false); }}>
                                <View style={{ width: '100%', height: 25, backgroundColor: 'white' }}>
                                    <Text style={{ width: '100%', color: 'black' }}>{item.farm}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    }
                />
            </ScrollView>
        )
    }

    const season = () => {
        return (
            <ScrollView>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => { setSeasonData(item.season); setOpenSeason(false) }}>
                                <View style={{ width: '100%', height: 25, backgroundColor: 'white' }}>
                                    <Text style={{ width: '100%', color: 'black' }}>{item.season}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    }
                />
            </ScrollView>
        )
    }


    useEffect(() => {
        fetchFarm();
        fetchPlot();
        fetchVariety();
        // console.log('json:', varietyData);
        setDate1(formattedDate);
    }, []
    );

    const handleDoubleClick = async (data) => {
        console.log('id:', data._id);
        const now = Date.now();
        if (now - lastTap < 2000) {
            const farm = await getFarm(data.farm);
            if (farm) {
                setFarmData(farm);
            }
            setFarmId(data.farm);
            setDate1(data.date);
            setBlock(data.block);
            setPlot(data.plot);
            setArea(data.area);
            setSeasonData(data.season);
            setRowSpace(data.rowspace);
            setVarietyInfo(data.variety);
            setPlotId(data._id);
        }
        setLastTap(now);
    };


    const handleDelete = async () => {
        if (deleting) return;

        if (!plotId) {
            Alert.alert("No plot selected to delete");
            return;
        }

        setDeleting(true);

        try {
            const res = await fetch(`${BaseUrl}/plot/${plotId}`, {
                method: "DELETE"
            });

            // await res.text(); 
            setDeleting(false);

            if (!res.ok) {
                throw new Error("Delete failed");
            }

            Alert.alert("plot deleted");
            setFarmId('');
            setFarmData('');
            setDate1(formattedDate);
            setBlock('');
            setPlot('');
            setArea('');
            setSeasonData('');
            setRowSpace('');
            setVarietyInfo('');
            setPlotId('');
            await fetchPlot();

        } catch (err) {
            console.error("Delete failed:", err);
            Alert.alert("Delete failed");
        } finally {
            setDeleting(false);
        }
    };

    const handleAlert = () => {
        if (plotId !== '') {
            Alert.alert(
                'Confirm Deletion',
                'Are you sure you want to delete this?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {
                            setFarmId('');
                            setFarmData('');
                            setDate1(formattedDate);
                            setBlock('');
                            setPlot('');
                            setArea('');
                            setSeasonData('');
                            setRowSpace('');
                            setVarietyInfo('');
                            setPlotId('');
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

    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center', backgroundColor: 'white', flex: 1 }}>
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
            <ScrollView style={{ width: '100%', flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }} showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center', backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, width:'80%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '40%' }}>
                            <View style={{ flexDirection: 'column', width: '120%', paddingRight: 5, paddingTop: 5, marginLeft:'15%' }}>
                                <Text style={{ fontWeight: 'bold', color: 'black' }}>Farm</Text>
                                <Pressable onPress={() => handleFarm()}>
                                    <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', height: 40, borderRadius: 8 }}>
                                        <Text
                                            style={{ width: '80%', alignItems: 'center', verticalAlign: 'middle', color: 'black', paddingLeft: '5%' }}
                                        >{farmData ? farmData : ''}</Text>

                                        <Image source={require('../assets/down.png')} style={{ height: 15, width: 15, alignSelf: 'center', marginTop: 10, marginLeft: 5, borderWidth: openFarm ? 1 : 0, padding: 5 }} />
                                    </View>
                                </Pressable>
                                {openFarm ? <View style={{ height: 80 }}>{farm()}</View> : ''}
                            </View>
                        </View>
                        <View style={{ alignSelf: 'flex-start', marginLeft: '2%', width:'45%' }}>
                            <DateItem
                                label="Entry Date"
                                value={[date1]}
                                onChange={setDate1}
                            />
                        </View>
                        {/* <View style={{ flexDirection: 'column', width: '38%', marginLeft: '2%' }}>
                            <Text style={{ fontWeight: 'bold', color: 'black' }}>Date</Text>
                            <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', height: 40, borderRadius: 8 }}>
                                <TextInput
                                    style={{
                                        width: '100%',
                                    }}
                                    onChangeText={handleDate}
                                    value={date1}
                                />
                            </View>
                        </View> */}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                        <View style={{ flexDirection: 'column', width: '40%' }}>
                            <Text style={{ fontWeight: 'bold', color: 'black' }}>Block</Text>
                            <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', borderRadius: 8, height: 40 }}>
                                <TextInput
                                    style={{ width: '100%' }}
                                    onChangeText={handleBlock}
                                    value={block}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', width: '40%', paddingLeft: 10 }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontWeight: 'bold', color: 'black' }}>Plot</Text>
                                <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', borderRadius: 8, height: 40 }}>
                                    <TextInput
                                        style={{ width: '100%' }}
                                        onChangeText={handlePlot}
                                        value={plot}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                        <View style={{ flexDirection: 'column', width: '40%' }}>
                            <Text style={{ fontWeight: 'bold', color: 'black' }}>Area</Text>
                            <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', borderRadius: 8, height: 40 }}>
                                <TextInput
                                    style={{ width: '100%' }}
                                    onChangeText={handleArea}
                                    value={area}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', width: '40%', paddingLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', color: 'black' }}>Crop Season</Text>
                            <Pressable onPress={() => handleSeason()}>
                                <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', borderRadius: 8, height: 40 }}>
                                    <Text
                                        style={{ width: '80%', verticalAlign: 'middle', color: 'black', paddingLeft: '5%' }}
                                    >{seasonData}</Text>
                                    <Image source={require('../assets/down.png')} style={{ height: 15, width: 15, alignSelf: 'center', marginTop: 10, marginLeft: 5, borderWidth: openSeason ? 1 : 0, padding: 5 }} />
                                </View>
                            </Pressable>
                            {openSeason ? <View style={{ height: 80 }}>{season()}</View> : ''}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                        <View style={{ flexDirection: 'column', width: '40%' }}>
                            <Text style={{ fontWeight: 'bold', color: 'black' }}>Row Space</Text>
                            <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', borderRadius: 8, height: 40 }}>
                                <TextInput
                                    style={{ width: '100%' }}
                                    onChangeText={handleRowSpace}
                                    value={rowSpace}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', width: '40%', paddingLeft: 10 }}>
                            <View style={{ flexDirection: 'column', width: '100%' }}>
                                <Text style={{ fontWeight: 'bold', color: 'black' }}>Variety</Text>
                                <Pressable onPress={() => { handleVariety() }}>
                                    <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', borderRadius: 8, height: 40 }}>
                                        <Text
                                            style={{ width: '80%', verticalAlign: 'middle', color: 'black', paddingLeft: '5%' }}
                                        >{varietyInfo}</Text>
                                        <Image source={require('../assets/down.png')} style={{ height: 15, width: 15, alignSelf: 'center', marginTop: 10, marginLeft: 5, borderWidth: openVariety ? 1 : 0, padding: 5 }} />
                                    </View>
                                </Pressable>
                                {openVariety ? <View style={{ height: 80 }}>{variety()}</View> : ''}
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%' }}>
                        <Pressable onPress={() => { handleSubmit() }} style={{ paddingTop: 50 }}>
                            <Text style={{ height: 30, width: 80, borderWidth: 1, borderColor: 'black', textAlign: 'center', paddingTop: 3, borderRadius: 5, elevation: 5, backgroundColor: 'black', color: 'white', fontWeight: '400' }}>Save</Text>
                        </Pressable>
                        <Pressable onPress={() => { handleAlert() }} style={{ paddingTop: 50 }}>
                            <Text style={{ height: 30, width: 80, borderWidth: 1, borderColor: 'red', textAlign: 'center', paddingTop: 3, borderRadius: 5, elevation: 5, backgroundColor: 'red', color: 'white', fontWeight: '400' }}>Delete</Text>
                        </Pressable>
                        <Pressable onPress={() => {
                            setFarmId('');
                            setFarmData('');
                            setDate1(formattedDate);
                            setBlock('');
                            setPlot('');
                            setArea('');
                            setSeasonData('');
                            setRowSpace('');
                            setVarietyInfo('');
                            setPlotId('');
                        }} style={{ paddingTop: 50 }}>
                            <Text style={{ height: 30, width: 80, borderWidth: 1, borderColor: 'green', textAlign: 'center', paddingTop: 3, borderRadius: 5, elevation: 5, backgroundColor: 'green', color: 'white', fontWeight: '400' }}>New</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.container2}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.column1}>
                                <Text style={styles.heading}>Date</Text>
                                <Text style={styles.heading}>Farm</Text>
                                <Text style={styles.heading}>Block</Text>
                                <Text style={styles.heading}>Plot</Text>
                                <Text style={styles.heading}>Area</Text>
                                <Text style={styles.heading}>Cr. Season</Text>
                                <Text style={styles.heading}>Row Space</Text>
                                <Text style={styles.heading}>Variety</Text>
                            </View>
                            {plotData.map((item) => (
                                <TouchableOpacity onPress={() => { handleDoubleClick(item) }} style={styles.column2} key={item._id}>
                                    <Text style={styles.text}>{item.date}</Text>
                                    <Text style={styles.text}>{farms[item?.farm] || 'Loading...'}</Text>
                                    <Text style={styles.text}>{item.block}</Text>
                                    <Text style={styles.text}>{item.plot}</Text>
                                    <Text style={styles.text}>{item.area}</Text>
                                    <Text style={styles.text}>{item.season}</Text>
                                    <Text style={styles.text}>{item.rowspace}</Text>
                                    <Text style={styles.text}>{item.variety}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
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