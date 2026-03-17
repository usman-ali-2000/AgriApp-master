import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, ActivityIndicator, Alert, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { BaseUrl } from "../assets/Data";
import theme from "../theme/GlobalTheme";
import DateItem from "../items/DateItem";
import SelectList from "../items/SelectList";
import Inputform2 from "../items/Inputform2";

export default function Receives({ route }) {

    const email = route.params.email;


    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;


    const focusRef = useRef(null);


    const [inputQuantity, setInputQuantity] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [userData, setUserData] = useState([]);
    const [date1, setDate1] = useState('');
    const [lastTap, setLastTap] = useState(0);
    const [receiveId, setReceiveId] = useState('');
    const [Suppliers, setSuppliers] = useState([]);
    const [selectedSup, setSelectedSup] = useState('');
    const [openSupplier, setOpenSupplier] = useState(false);
    const [products, setProducts] = useState([]);
    const [openProd, setOpenProd] = useState(false);
    const [selectedProd, setSelectedProd] = useState('');
    const [code, setCode] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BaseUrl}/receive`);
            const response1 = await fetch(`${BaseUrl}/supplier`);
            const response2 = await fetch(`${BaseUrl}/counter`);
            const response3 = await fetch(`${BaseUrl}/product`);
            const json = await response.json();
            const json1 = await response1.json();
            const json2 = await response2.json();
            const json3 = await response3.json();
            // console.log('json:', json1);
            const formattedId = `${year}-${String(json2[1] ? json2[1].seq + 1 : 1).padStart(4, '0')}`;
            setUserData(json);
            setSuppliers(json1);
            setCode(formattedId);
            setProducts(json3);
        } catch (error) {
            console.log('error in fetching...');
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (text) => {
        setInputQuantity(text);
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
            setSelectedSup(data?.supplier);
            setSelectedProd(data?.product);
            setInputQuantity(data?.quantity?.toString());
            setReceiveId(data._id);
            setDate1(data.date);
            setCode(data?.id);
        }
        setLastTap(now);
    };

    const handleSubmit = async () => {
        // const checkReceive = await userData.find((item) => item.email === email && item.receive === inputQuantity);

        if (receiveId === '') {
            if (inputQuantity !== '') {
                setModalVisible(true);
                console.log('submit', inputQuantity);
                const data = { email, date: date1, supplier: selectedSup, product: selectedProd, quantity: inputQuantity };
                await fetch(`${BaseUrl}/receive`, {
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
            await updateReceive();
        }
        setInputQuantity('');
        fetchData();
    };


    const handleDelete = async () => {
        if (deleting) return;

        if (!receiveId) {
            Alert.alert("No receive selected to delete");
            return;
        }

        setDeleting(true);

        try {
            const res = await fetch(`${BaseUrl}/receive/${receiveId}`, {
                method: "DELETE"
            });

            // await res.text(); 
            setDeleting(false);

            if (!res.ok) {
                throw new Error("Delete failed");
            }

            Alert.alert("Receive deleted");
            setReceiveId('');
            setInputQuantity('');
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

    async function updateReceive() {
        try {
            const res = await fetch(`${BaseUrl}/receive/${receiveId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, date: date1, supplier: selectedSup, product: selectedProd, quantity: inputQuantity }),
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Failed to update receive");
            }

            const data = await res.json();
            console.log("Updated receive:", data);
            Alert.alert('receive updated...');
            if (res.ok) {
                setReceiveId('');
            }
            return data;
        } catch (err) {
            console.error("Update failed:", err);
            throw err;
        }
    }


    const handleAlert = () => {
        if (inputQuantity !== '') {
            Alert.alert(
                'Confirm Deletion',
                'Are you sure you want to delete this?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: async () => {
                            setInputQuantity('');
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
            {isModalVisible || loading && (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            {deleting && (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                    <View style={{
                        width: '45%'
                    }}>
                        <Inputform2 heading="Code" value={code} />
                    </View>
                    <View style={{ width: '45%', alignSelf: 'flex-start', marginLeft: '5%' }}>
                        <DateItem
                            label="Entry Date"
                            value={[date1]}
                            onChange={setDate1}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                    <View style={{ width: '45%' }}>
                        <SelectList
                            heading={"Supplier"}
                            data={Suppliers}
                            labelKey="supplier"
                            placeholder="Select Supplier"
                            value={selectedSup}   // full selected object OR null
                            onChange={(item) => setSelectedSup(item)}
                            onClose={() => setOpenSupplier(false)}
                        />
                    </View>
                    <View style={{ width: '45%' }}>
                        <SelectList
                            heading={"Product"}
                            data={products}
                            labelKey="product"
                            placeholder="Select Product"
                            value={selectedProd}
                            onChange={(item) => setSelectedProd(item)}
                            onClose={() => setOpenProd(false)}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'column', width: '45%', marginTop: '5%' }}>
                    <Text style={{ width: '100%', fontSize: 15, color: 'black' }}>Enter Quantity</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            ref={focusRef}
                            style={{
                                color: 'black',
                                width: '100%',
                                backgroundColor: 'lightgrey',
                                marginVertical: 10,
                                borderRadius: 8,
                                height: 45
                            }}
                            placeholder="Enter Quantity"
                            onChangeText={handleTextChange}
                            value={inputQuantity}
                            secureTextEntry={false}
                        />
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.colors.black, marginLeft:'5%'}}>{selectedProd ? selectedProd.unit : ''}</Text>
                    </View>
                </View>
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
                    <Pressable onPress={async () => {
                        setDate1(formattedDate);
                        setReceiveId('');
                        setInputQuantity('');
                        setSelectedSup('');
                        setSelectedProd('');
                        await fetchData();
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
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.column1}>
                                <Text style={styles.heading}>Code</Text>
                                <Text style={styles.heading}>Date</Text>
                                <Text style={styles.heading}>Supplier</Text>
                                <Text style={styles.heading}>Product</Text>
                                <Text style={styles.heading}>Quantity</Text>
                            </View>
                            {userData?.map((item) => (
                                <TouchableOpacity onPress={() => { handleDoubleClick(item) }} style={styles.column2} key={item._id}>
                                    <Text style={styles.text}>{item.id}</Text>
                                    <Text style={styles.text}>{item.date}</Text>
                                    <Text style={styles.text}>{item.supplier.supplier}</Text>
                                    <Text style={styles.text}>{item.product.product}</Text>
                                    <Text style={styles.text}>{item.quantity} {item.product.unit}</Text>
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
