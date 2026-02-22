import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ScrollView, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from "react-native";
import { BaseUrl } from "../assets/Data";
import theme from "../theme/GlobalTheme";

export default function Product({ route }) {

    const email = route.params.email;


    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;


    const [openCategory, setOpenCategory] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [catData, setCatData] = useState([]);
    const [catInfo, setCatInfo] = useState('');
    const [product, setProduct] = useState('');
    const [unit, setUnit] = useState('');
    const [qty, setQty] = useState();
    const [date1, setDate1] = useState();
    const [userData, setUserData] = useState([]);


    const fetchCategory = async () => {
        const response = await fetch(`${BaseUrl}/category/${email}`);
        const responsePr = await fetch(`${BaseUrl}/product`);
        const json = await response.json();
        const jsonpr = await responsePr.json();
        setCatData(json);
        setUserData(jsonpr);
        console.log('json:', json);
    }

    const handleCategory = () => {
        if (openCategory) {
            setOpenCategory(false);
        } else {
            setOpenCategory(true);
        }
    }

    const handleDate = (text) => {
        setDate1(text);
    }

    const handleSubmit = async () => {
        if (product !== '' && qty !== '' && unit !== '') {
            const data = { email, category: catInfo, product, qty, unit, date: date1 };
            await fetch(`${BaseUrl}/product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((json) => console.log(json))
                .then(() => { Alert.alert('successfully uploaded...') })
                .catch((error) => console.error(error));
        }
        setProduct('');
        setUnit('');
        setQty('');
    }

    const category = () => {
        return (
            <ScrollView>
                <FlatList
                    data={catData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => { setCatInfo(item.category); setOpenCategory(false); }}>
                                <View style={{ width: '100%', borderColor: 'black', height: 25 }}>
                                    <Text style={{ width: '100%', color: 'black' }}>{item.category}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    } />
            </ScrollView>
        )
    }

    const handleProduct = (text) => {
        setProduct(text);
    }

    const handleQty = (text) => {
        setQty(text);
    }

    const handleUnit = (text) => {
        setUnit(text);
    }

    useEffect(() => {
        fetchCategory();
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%' }}>
                    <View style={{ flexDirection: 'column', width: '50%' }}>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>Category</Text>
                        <Pressable onPress={() => { handleCategory() }}>
                            <View style={{ flexDirection: 'row', paddingTop: 8, paddingRight: 10, height: 40, backgroundColor: 'lightgrey', borderRadius: 8 }}>
                                <Text
                                    style={{ width: '80%', color: 'black', paddingLeft: '5%' }}
                                >{catInfo}</Text>
                                <Image source={require('../assets/down.png')} style={{ height: 15, width: 15, alignSelf: 'center', marginTop: 10, marginLeft: 15, marginBottom: 10, borderWidth: openCategory ? 1 : 0, padding: 5, }} />
                            </View>
                        </Pressable>
                        {openCategory ? <View style={{ height: 80, paddingLeft: '5%' }}>{category()}</View> : ''}
                    </View>
                    <View style={{ flexDirection: 'column', width: '45%' }}>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>Date</Text>
                        <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', height: 40, borderRadius: 8, paddingLeft: '5%' }}>
                            <TextInput
                                style={{
                                    width: '100%',
                                    color: 'black',
                                    paddingLeft: '5%'
                                }}
                                onChangeText={handleDate}
                                value={date1}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                    <View style={{ flexDirection: 'column', width: '40%' }}>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>Product</Text>
                        <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                            <TextInput
                                style={{ width: '100%', color: 'black', paddingLeft: '5%' }}
                                onChangeText={handleProduct}
                                value={product}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', width: '15%', paddingLeft: 5 }}>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>Qty</Text>
                        <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey' }}>
                            <TextInput
                                style={{ width: '100%', backgroundColor: 'lightgrey', color: 'black', paddingLeft: '5%' }}
                                onChangeText={handleQty}
                                value={qty}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', width: '15%', paddingLeft: 5 }}>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>Unit</Text>
                        <View style={{ flexDirection: 'row', backgroundColor: 'lightgrey', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                            <TextInput
                                style={{ width: '100%', backgroundColor: 'lightgrey', borderTopRightRadius: 8, borderBottomRightRadius: 8, color: 'black', paddingLeft: '5%' }}
                                onChangeText={handleUnit}
                                value={unit}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '70%' }}>
                    <Pressable onPress={() => { handleSubmit() }} style={{ paddingTop: 50 }}>
                        <Text style={{ height: 30, width: 80, borderWidth: 1, borderColor: 'black', textAlign: 'center', paddingTop: 3, borderRadius: 5, elevation: 5, backgroundColor: 'black', color: 'white', fontWeight: '400' }}>Save</Text>
                    </Pressable>
                    <Pressable onPress={() => { handleSubmit() }} style={{ paddingTop: 50 }}>
                        <Text style={{ height: 30, width: 80, borderWidth: 1, borderColor: 'red', textAlign: 'center', paddingTop: 3, borderRadius: 5, elevation: 5, backgroundColor: 'red', color: 'white', fontWeight: '400' }}>Delete</Text>
                    </Pressable>
                    <Pressable onPress={() => { handleSubmit() }} style={{ paddingTop: 50 }}>
                        <Text style={{ height: 30, width: 80, borderWidth: 1, borderColor: 'green', textAlign: 'center', paddingTop: 3, borderRadius: 5, elevation: 5, backgroundColor: 'green', color: 'white', fontWeight: '400' }}>New</Text>
                    </Pressable>
                </View>
                <View style={styles.container2}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.column1}>
                                <Text style={styles.heading}>Date</Text>
                                <Text style={styles.heading}>Category</Text>
                                <Text style={styles.heading}>Product</Text>
                                <Text style={styles.heading}>Qty</Text>
                                <Text style={styles.heading}>Unit</Text>
                            </View>
                            {userData.map((item) => (
                                <TouchableOpacity onPress={() => { handleDoubleClick(item) }} style={styles.column2} key={item._id}>
                                    <Text style={styles.text}>{item.date}</Text>
                                    <Text style={styles.text}>{item.category}</Text>
                                    <Text style={styles.text}>{item.product}</Text>
                                    <Text style={styles.text}>{item.qty}</Text>
                                    <Text style={styles.text}>{item.unit}</Text>
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
