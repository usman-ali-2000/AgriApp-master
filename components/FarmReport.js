import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, FlatList } from "react-native";
import InputText from "../items/InputText";
import { BaseUrl, toBackendFormat } from "../assets/Data";
import theme from "../theme/GlobalTheme";
import { useFocusEffect } from "@react-navigation/native";
import Inputform2 from "../items/Inputform2";
import { Calendar } from "react-native-calendars";
import DatePickerCalendar from "../items/DatePickerComponent";
import Inputform from "../items/Inputform";

const FarmReport = ({ route, navigation }) => {

    const email = route.params.email;

    const Api_Url = `${BaseUrl}/dailyentry`;

    const [farm, setFarm] = useState(null);
    const [farmName, setFarmName] = useState('');
    const [userData, setUserData] = useState({});
    const [openFarm, setOpenFarm] = useState(false);
    const [dailyData, setDailyData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [farmData, setFarmData] = useState({});
    const [farms, setFarms] = useState([]);
    const [lastTap, setLastTap] = useState(0);
    const [date, setDate] = useState(null);
    const [date2, setDate2] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCalendar2, setShowCalendar2] = useState(false);

    const fetchDailyEntry = async () => {
        setLoading(true);
        try {
            const response = await fetch(Api_Url);
            const response2 = await fetch(`${BaseUrl}/farm`);
            const json = await response.json();
            const json2 = await response2.json();
            setDailyData(json);
            setFilteredData(json);
            setFarms(json2);
        } catch (error) {
            console.error('Error fetching daily entries:', error);
        }
        setLoading(false);
    };

    const farmsData = () => {
        return (
            <ScrollView>
                <FlatList
                    data={userData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setFarm(item._id); setOpenFarm(false); setFarmName(item.farm);
                                // if(plot !=='' && block !== ''){
                                //     fetchPlotNo();
                                // }
                            }}>
                                <View style={{ width: '100%', borderColor: 'black', height: 25 }}>
                                    <Text style={{ width: '100%', verticalAlign: "middle", color: 'black' }}>{item.farm}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    }
                />
            </ScrollView>
        )
    }


    const fetchFarm = async () => {
        const response = await fetch(`${BaseUrl}/farm`);
        const json = await response.json();
        setUserData(json);
        // console.log('farm:', userData);
    }

    // Fetch farm data
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

    // Handle search input
    const handleSearch = (txt) => {
        setSearch(txt);
        handleFilter(txt);
    };

    const handleDate = (text) => {
        console.log('date:', text);
        setDate(text);
        setShowCalendar(false);
    }
    const handleDate2 = (text) => {
        console.log('date:', text);
        setDate2(text);
        setShowCalendar(false);
    }


    // Filter daily data based on search
    const handleFilter = (txt) => {
        const searchText = txt.toLowerCase();
        const filtered = dailyData.filter((item) =>
            item.stage.toLowerCase().includes(searchText) ||
            item.id.toString() === txt
        );
        const matchingFarms = farms.filter((farm) =>
            farm.farm.toLowerCase().includes(searchText)
        );
        const filteredByFarm = dailyData.filter((item) =>
            matchingFarms.some((farm) => farm._id === item.farm)
        );
        const finalFilteredData = [...new Set([...filtered, ...filteredByFarm])];

        setFilteredData(finalFilteredData);
    };

    const handleDoubleClick = (data) => {
        const now = Date.now();
        if (now - lastTap < 1000) {
            navigation.navigate('UpdateDailyEntry', { data: data });
        }
        setLastTap(now);
    };

    useEffect(() => {
        const fetchFarms = async () => {
            const farms = {};
            for (const item of filteredData) {
                if (!farms[item.farm]) {
                    farms[item.farm] = await getFarm(item.farm);
                }
            }
            setFarmData(farms);
        };
        if (filteredData.length > 0) {
            fetchFarms();
        }
    }, [filteredData]);

    const fetchFarmRep = async () => {
        setLoading(true);
        const newDate = toBackendFormat(date).toString();
        const newDate2 = toBackendFormat(date2).toString();

        // const day = date.getDate();
        // const month = date.getMonth() + 1;
        // const year = date.getFullYear();
        // const newDate = "16/2/2025";
        console.log('new date', newDate, newDate2);
        try {
            const response = await fetch(`${BaseUrl}/dailyentry/filter-range`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ startDate: newDate, endDate: newDate2, farmId: farm }), // "16/2/2025"
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const json = await response.json();
            console.log('Filtered entries:', json);
            setFilteredData(json);
            return json;
        } catch (error) {
            console.error('Error fetching daily entries:', error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchFarmRep();
    // }, [date2]);

    const handleRepo = async () => {
        if (date && date2 && farm) {
            await fetchFarmRep();
        } else {
            alert('Fill the required fields');
        }
    }

    useEffect(() => {
        fetchFarm();
    }, []);

    // useFocusEffect(
    //     useCallback(() => {
    //         fetchDailyEntry();
    //     }, [])
    // );

    const handleFarm = () => {
        if (openFarm) {
            setOpenFarm(false);
        } else {
            setOpenFarm(true);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '90%' }}>
                    <TouchableOpacity onPress={() => { setShowCalendar(true) }} style={{
                        width: '45%',
                        paddingLeft: '15%'
                    }}>
                        <Inputform2 heading="Start Date" value={date} onChange={handleDate} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setShowCalendar2(true) }} style={{
                        width: '45%',
                        paddingLeft: '15%'
                    }}>
                        <Inputform2 heading="End Date" value={date2} onChange={handleDate2} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '90%' }}>
                    <View style={{
                        width: '45%'
                    }}>
                        <Inputform heading="Farm" text={farmName} onPress={() => { handleFarm() }} openDrop={openFarm} Dropdown={farmsData()} />
                    </View>
                    <TouchableOpacity onPress={handleRepo} style={{ padding: 10, marginTop: '5%', backgroundColor: theme.colors.blue, borderRadius: 5, marginLeft: '5%' }}>
                        <Text style={{ color: theme.colors.white }}>Done</Text>
                    </TouchableOpacity>
                </View>
                {/* <Text>{date}</Text> */}
                {showCalendar &&
                    <View>
                        < DatePickerCalendar
                            selectedDate={date}
                            onSelectDate={setDate}
                            markedColor="orange"
                            showCal={showCalendar}
                            setShowCal={setShowCalendar}
                        />
                    </View>}
                {showCalendar2 &&
                    <View>
                        < DatePickerCalendar
                            selectedDate={date2}
                            onSelectDate={setDate2}
                            markedColor="orange"
                            showCal={showCalendar2}
                            setShowCal={setShowCalendar2}
                        />
                    </View>}
                {loading && (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text>Loading...</Text>
                    </View>
                )}

                <View style={styles.container2}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <View style={styles.column1}>
                                <Text style={styles.heading}>Code</Text>
                                <Text style={styles.heading}>Farm</Text>
                                <Text style={styles.heading}>Plot</Text>
                                <Text style={styles.heading}>Area</Text>
                                <Text style={styles.heading}>Stage</Text>
                                <Text style={styles.heading}>Type</Text>
                                <Text style={styles.heading}>Deal</Text>
                                <Text style={styles.heading}>Time</Text>
                                <Text style={styles.heading}>Date</Text>
                                <Text style={styles.heading}>Mean</Text>
                                <Text style={styles.heading}>Fuel</Text>
                                <Text style={styles.heading}>Person</Text>
                                <Text style={styles.heading}>Quantity</Text>
                                <Text style={styles.heading}>Moga</Text>
                                <Text style={styles.heading}>Units</Text>
                            </View>
                            {filteredData.map((item) => (
                                <TouchableOpacity onPress={() => { handleDoubleClick(item) }} style={styles.column2} key={item.id}>
                                    <Text style={styles.text}>{item.id}</Text>
                                    <Text style={styles.text}>{farmData[item.farm] || 'Loading...'}</Text>
                                    <Text style={styles.text}>{item.plot}</Text>
                                    <Text style={styles.text}>{item.area}</Text>
                                    <Text style={styles.text}>{item.stage}</Text>
                                    <Text style={styles.text}>{item.type}</Text>
                                    <Text style={styles.text}>{item.deal}</Text>
                                    <Text style={styles.text}>{item.time} hrs</Text>
                                    <Text style={styles.text}>{item.date}</Text>
                                    <Text style={styles.text}>{item.mean}</Text>
                                    <Text style={styles.text}>{item.fuel}</Text>
                                    <Text style={styles.text}>{item.person}</Text>
                                    <Text style={styles.text}>{item.quantity}</Text>
                                    <Text style={styles.text}>{item.moga}</Text>
                                    <Text style={styles.text}>{item.units}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

export default FarmReport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    container2: {
        flexDirection: 'row',
        width: '95%',
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
