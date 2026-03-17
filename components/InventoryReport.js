import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ScrollView, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { BaseUrl } from "../assets/Data";
import theme from "../theme/GlobalTheme";
import DateItem from "../items/DateItem";
import SelectList from "../items/SelectList";

export default function InventoryReport({ route }) {

    const email = route.params.email;
    const [isLoading, setIsLoading] = useState(false);
    const [ledgerData, setledgerData] = useState([]);
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [farm, setFarm] = useState();
    const [product, setProduct] = useState();
    const [farms, setFarms] = useState([]);
    const [openFarm, setOpenFarm] = useState(false);
    const [products, setProducts] = useState([]);
    const [openProduct, setOpenProduct] = useState(false);

    const fetchdata = async () => {

        try {
            setIsLoading(true);
            const farmRes = await fetch(`${BaseUrl}/farm`);
            const prodRes = await fetch(`${BaseUrl}/product`);
            const farmJson = await farmRes.json();
            const prodJson = await prodRes.json();

            setFarms(farmJson);
            setProducts(prodJson);
        } catch (e) {
            console.log('error fetching data', e);
        } finally {
            setIsLoading(false);
        }

    }


    const getInventoryReport = async () => {
        try {
            if (!from || !to || !farm || !product) {
                Alert.alert('All fields are Mendatory');
                return;
            }
            setIsLoading(true);
            const response = await fetch(`${BaseUrl}/inventory-report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: from,
                    to: to,
                    farm: farm._id,
                    // product: "66cedc878a3a43915775645f"
                    product: product._id
                })
            });

            const data = await response.json();
            console.log("Inventory Report:", data);
            setledgerData(data.ledger);
        } catch (error) {
            console.error("Error fetching inventory report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%', alignItems: 'center', backgroundColor: 'white' }}>
            {isLoading && (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading...</Text>
                </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', justifyContent: 'space-between' }}>
                <View style={{ width: '45%' }}>
                    <DateItem label="From"
                        value={[from]}
                        onChange={setFrom}
                    />
                </View>
                <View style={{ width: '45%' }}>
                    <DateItem label="To"
                        value={[to]}
                        onChange={setTo}
                    />
                </View>
            </View>
            <View style={{
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '2%'
            }}>
                <View style={{ width: '45%' }}>
                    <SelectList
                        heading={"Farm"}
                        data={farms}
                        labelKey="farm"
                        placeholder="Select Farm"
                        value={farm}   // full selected object OR null
                        onChange={(item) => setFarm(item)}
                        onClose={() => setOpenFarm(false)}
                    />
                </View>
                <View style={{ width: '45%' }}>
                    <SelectList
                        heading={"Product"}
                        data={products}
                        labelKey="product"
                        placeholder="Select Product"
                        value={product}   // full selected object OR null
                        onChange={(item) => setProduct(item)}
                        onClose={() => setOpenProduct(false)}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={getInventoryReport} style={{ padding: 10, marginTop: '5%', backgroundColor: theme.colors.blue, borderRadius: 5, marginLeft: '5%', alignItems: 'center', width: '30%' }}>
                <Text style={{ color: theme.colors.white }}>Get 🔍</Text>
            </TouchableOpacity>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={styles.container2}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.column1}>
                                <Text style={styles.heading}>Date</Text>
                                <Text style={styles.heading}>Detail</Text>
                                <Text style={styles.heading}>Receipt</Text>
                                <Text style={styles.heading}>Issued</Text>
                                <Text style={styles.heading}>Balance</Text>
                            </View>
                            {ledgerData.map((item) => (
                                <View style={styles.column2} key={item._id}>
                                    <Text style={styles.text}>{item.date && formatDate(item.date)}</Text>
                                    <Text style={styles.text}>{item.type === 'opening' ? 'Opening Balance' : item.detail}</Text>
                                    <Text style={styles.text}>{item.type === 'receive' && item.quantity}</Text>
                                    <Text style={styles.text}>{item.type === 'issue' && item.quantity}</Text>
                                    <Text style={styles.text}>{item.balance}</Text>
                                </View>
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
