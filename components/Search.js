import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import InputText from "../items/InputText";
import { BaseUrl } from "../assets/Data";
import theme from "../theme/GlobalTheme";
import { useFocusEffect } from "@react-navigation/native";

const Search = ({ route, navigation }) => {

    const email = route.params.email;

    const Api_Url = `${BaseUrl}/dailyentry`;

    const [dailyData, setDailyData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [farmData, setFarmData] = useState({});
    const [farms, setFarms] = useState([]);
    const [lastTap, setLastTap] = useState(0);

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
            for (const item of dailyData) {
                if (!farms[item.farm]) {
                    farms[item.farm] = await getFarm(item.farm);
                }
            }
            setFarmData(farms);
        };
        if (dailyData.length > 0) {
            fetchFarms();
        }
    }, [dailyData]);

    useEffect(() => {
        fetchDailyEntry();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchDailyEntry(); 
        }, [])
    );

    return (
        <View style={styles.container}>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                <InputText placeholder="Search here" value={search} onChange={handleSearch} />

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
                                <TouchableOpacity onPress={()=>{handleDoubleClick(item)}} style={styles.column2} key={item.id}>
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

export default Search;

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
