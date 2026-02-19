import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert, Pressable, ActivityIndicator } from "react-native";
import Inputform from "../items/Inputform";
import Inputform2 from "../items/Inputform2";
import { BaseUrl } from "../assets/Data";

export default function UpdateDailyEntry({ route, navigation }) {

    const data = route.params.data;

    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const [farm, setFarm] = useState(data.farm);
    const [farmName, setFarmName] = useState('');
    const [openFarm, setOpenFarm] = useState(false);
    const [userData, setUserData] = useState([]);
    const [block, setBlock] = useState('');
    const [plot, setPlot] = useState(data.plot);
    const [plotData, setPlotData] = useState([]);
    const [openPlot, setOpenPlot] = useState(false);
    const [area, setArea] = useState(data.area);
    const [vehicleInfo, setVehicleInfo] = useState([]);
    const [openStage, setOpenStage] = useState(false);
    const [fuel, setFuel] = useState(0);
    const [stage, setStage] = useState(data.stage);
    const [subStage, setSubStage] = useState(data.type);
    const [openSubStage, setOpenSubStage] = useState(null);
    const [contract, setContract] = useState(false);
    const [self, setSelf] = useState(true);
    const [date1, setDate1] = useState(data.date);
    const [length, setLength] = useState(0);
    const [duration, setDuration] = useState(false);
    const [durationPeriod, setDurationPeriod] = useState(null);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);
    const [diesel, setDiesel] = useState(data.fuel);
    const [subFertilizer, setSubFertilizer] = useState(data.type);
    const [openSubFertilizer, setOpenSubFertilizer] = useState(null);
    const [manpower, setManPower] = useState(false);
    const [persons, setPersons] = useState(0);
    const [sowingType, setSowingType] = useState(null);
    const [subWeedicides, setSubWeedicides] = useState(data.type);
    const [openSubWeedicides, setOpenSubWeedicides] = useState(false);
    const [qty, setQty] = useState(data.quantity);
    const [subIrrigation, setSubIrrigation] = useState(data.type);
    const [openSubIrrigation, setOpenSubIrrigation] = useState(false);
    const [subPesticides, setSubPesticides] = useState(data.type);
    const [openSubPesticides, setOpenSubPesticides] = useState(false);
    const [unit, setUnit] = useState(data.units);
    const [moga, setMoga] = useState(data.moga);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [subsowing, setSubSowing] = useState(data.type);
    const [openSubSowing, setOpenSubSowing] = useState(false);
    const [dailyentry, setDailyentry] = useState([]);
    const [loading, setLoading] = useState(false);


    const stageInfo = [
        {
            stage: "land preparation"
        }, {
            stage: "fertilizer"
        }, {
            stage: "sowing"
        }, {
            stage: "weedicides"
        }, {
            stage: "irrigation"
        }, {
            stage: "pesticides"
        }
    ]

    const substageInfo = [
        {
            text: "Gobal"
        }, {
            text: "Cultivator"
        }, {
            text: "Routavator"
        }, {
            text: "Laser Level"
        }, {
            text: "Chiesel"
        }, {
            text: "Khila"
        },
    ]

    const subFertilizerInfo = [
        {
            text: "DAP"
        }, {
            text: "Urea"
        }
    ]

    const subWeedicidesInfo = [
        {
            text: "Gangwel Syngent"
        }, {
            text: "Reverse Plus Target"
        }
    ]
    const subPesticidesInfo = [
        {
            text: "type 1"
        }, {
            text: "type 2"
        }
    ]

    const subSowingInfo = [
        {
            text: "type 1"
        }, {
            text: "type 2"
        }
    ]

    const subIrrigationInfo = [
        {
            text: "canal"
        }, {
            text: "electric turbine"
        }, {
            text: "china engine"
        }, {
            text: "solar"
        }
    ]

    const fetchDailyEntry = async () => {
        try {
            const response = await fetch(`${BaseUrl}/dailyentry`);
            const json = await response.json();
            setDailyentry(json);
            // console.log('json imp:', json);
            const lng = json[json.length - 1];
            let newLng = lng.id;
            setLength(newLng + 1);
            // setBaseLng(newLng+1);
        } catch (e) {
            console.log('error...', e);
        }
    }



    const fetchFarm = async () => {
        const response = await fetch(`${BaseUrl}/farm`);
        const json = await response.json();
        const farmname = await json.find((item) => (item._id === data.farm));
        setFarmName(farmname.farm);
        setUserData(json);
        console.log('farm:', json, farmname);
    }

    const fetchPlot = async () => {
        const response = await fetch(`${BaseUrl}/plot`);
        const json = await response.json();
        setPlotData(json);
        // console.log('farm:', userData);
    }

    const fetchVehicle = async () => {

        const response = await fetch(`${BaseUrl}/vehicle`);
        const json = await response.json();
        setVehicleInfo(json);
        // console.log('vehicle:', json);

    }
    const handleSowingType = (text) => {
        setSowingType(text);
    }

    const handleUnit = (text) => {
        setUnit(text);
    }
    const handleMoga = (text) => {
        setMoga(text);
    }
    const handleQty = (text) => {
        setQty(text);
    }

    const handlePerson = (text) => {
        setPersons(text);
    }

    const handleDiesel = (text) => {
        setDiesel(text);
    }

    const handleDurationPeriod = (text) => {
        setDurationPeriod(text);
    }

    const handleDate = (text) => {
        setDate1(text);
    }

    const handleLength = (text) => {
        setLength(text);
    }

    const handleStart = (text) => {
        setStart(text);
    }

    const handleEnd = (text) => {
        setEnd(text);
    }

    const handleSubmit = async () => {
        console.log("ID:", data?._id);
    
        // Check if required fields are missing
        if (!farm || !plot || !area || !stage) {
            Alert.alert("Required fields are empty");
            return; // Stop execution here
        }
    
        setLoading(true);
    
        try {
            // Construct data payload
            const payload = {
                id: length,
                farm: farm,
                plot: block + plot,
                area: area,
                stage: stage,
                type: subStage,
                deal: contract ? "contract" : "self",
                time: duration ? durationPeriod : `${start} to ${end}`,
                mean: contract ? null : manpower ? "Man Power" : "Tractor",
                fuel: contract ? null : manpower ? null : diesel,
                person: contract ? null : manpower ? persons : null,
                quantity: qty,
                moga: moga,
                units: unit,
                email: data?.email,
                date: date1,
            };
    
            // API Request
            const response = await fetch(`${BaseUrl}/dailyentry/${data?._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            // Handle Response
            if (response.ok) {
                Alert.alert("Updated Successfully!");
                fetchDailyEntry(); // Fetch new data only on success
            } else {
                Alert.alert("Error updating data.");
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };
    



    // const fetchPlotNo = async() => {
    //     console.log(farm, block, plot);
    //         if(farm !== '' && block !== '' && plot !== ''){
    //     const response = await fetch(`http://localhost:3000/plot/${email}/${farm}/${block}/${plot}`);
    //     const json = await response.json();
    //     console.log('json data:', json);
    //     json.map((item)=>{
    //         setArea(item.area);
    //         setRowspace(item.rowspace);
    //         setSeason(item.season);
    //         setVariety(item.variety);
    //     })
    //  if(json.length !== 0){
    //      setPlotNoData(json);
    //      console.log('plotno:', plotNoData);
    //     }
    // }
    // }

    const farmData = () => {
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

    const plotInfo = () => {
        return (
            <ScrollView>
                <FlatList
                    data={plotData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={async () => {
                                setBlock(item.block);
                                setPlot(item.plot);
                                setOpenPlot(false);
                            }
                            }>
                                <View style={{ width: '100%', borderColor: 'black', height: 25 }}>
                                    <Text style={{ width: '100%', verticalAlign: "middle", color: 'black' }}>{item.block}{item.plot}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    }
                />
            </ScrollView>
        )
    }

    const stageData = () => {
        return (
            <ScrollView>
                <FlatList
                    data={stageInfo}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setStage(item.stage);
                                setOpenStage(false);
                            }}>
                                <View style={{ width: '100%', borderColor: 'black', height: 25 }}>
                                    <Text style={{ width: '100%', verticalAlign: "middle", color: 'black' }}>{item.stage}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    } />
            </ScrollView>
        )
    }

    const substageData = () => {
        return (
            <ScrollView>
                <FlatList
                    data={substageInfo}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setSubStage(item.text);
                                setOpenSubStage(false);
                            }}>
                                <View style={{ width: '100%', borderColor: 'black', height: 25 }}>
                                    <Text style={{ width: '100%', verticalAlign: "middle", color: 'black' }}>{item.text}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    } />
            </ScrollView>
        )
    }

    const subfertilizerData = () => {
        return (
            <ScrollView>
                <FlatList
                    data={subFertilizerInfo}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setSubFertilizer(item.text);
                                setOpenSubFertilizer(false);
                            }}>
                                <View style={{ width: '100%', borderColor: 'black', height: 25 }}>
                                    <Text style={{ width: '100%', verticalAlign: "middle", color: 'black' }}>{item.text}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    } />
            </ScrollView>
        )
    }


    const subWeedicidesData = () => {
        return (
            <ScrollView>
                <FlatList
                    data={subWeedicidesInfo}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setSubWeedicides(item.text);
                                setOpenSubWeedicides(false);
                            }}>
                                <View style={{ width: '100%', borderColor: 'black', height: 25 }}>
                                    <Text style={{ width: '100%', verticalAlign: "middle", color: 'black' }}>{item.text}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    } />
            </ScrollView>
        )
    }

    const subPesticidesData = () => {
        return (
            <ScrollView>
                <FlatList
                    data={subPesticidesInfo}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setSubPesticides(item.text);
                                setOpenSubPesticides(false);
                            }}>
                                <View style={{ width: '100%', borderColor: 'black', height: 25 }}>
                                    <Text style={{ width: '100%', verticalAlign: "middle", color: 'black' }}>{item.text}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    } />
            </ScrollView>
        )
    }

    const subSowingData = () => {
        return (
            <ScrollView>
                <FlatList
                    data={subSowingInfo}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setSubSowing(item.text);
                                setOpenSubSowing(false);
                            }}>
                                <View style={{ width: '100%', borderColor: 'black', height: 25 }}>
                                    <Text style={{ width: '100%', verticalAlign: "middle", color: 'black' }}>{item.text}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    } />
            </ScrollView>
        )
    }

    const subIrrigationData = () => {
        return (
            <ScrollView>
                <FlatList
                    data={subIrrigationInfo}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => {
                                setSubIrrigation(item.text);
                                setOpenSubIrrigation(false);
                            }}>
                                <View style={{ width: '100%', borderColor: 'black', height: 25 }}>
                                    <Text style={{ width: '100%', verticalAlign: "middle", color: 'black' }}>{item.text}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    } />
            </ScrollView>
        )
    }



    const handleStage = () => {
        if (openStage) {
            setOpenStage(false);
        } else {
            setOpenStage(true);
        }
    }

    const handleSubWeedicides = () => {
        if (openSubWeedicides) {
            setOpenSubWeedicides(false);
        } else {
            setOpenSubWeedicides(true);
        }
    }

    const handlePesticides = () => {
        if (openSubPesticides) {
            setOpenSubPesticides(false);
        } else {
            setOpenSubPesticides(true);
        }
    }

    const handleSubIrrigation = () => {
        if (openSubIrrigation) {
            setOpenSubIrrigation(false);
        } else {
            setOpenSubIrrigation(true);
        }
    }

    const handleSubFertilizer = () => {
        if (openSubFertilizer) {
            setOpenSubFertilizer(false);
        } else {
            setOpenSubFertilizer(true);
        }
    }

    const handleSubStage = () => {
        if (openSubStage) {
            setOpenSubStage(false);
        } else {
            setOpenSubStage(true);
        }
    }

    const handleSubSowing = () => {
        if (openSubSowing) {
            setOpenSubSowing(false);
        } else {
            setOpenSubSowing(true);
        }
    }


    const handleFarm = () => {
        if (openFarm) {
            setOpenFarm(false);
        } else {
            setOpenFarm(true);
        }
    }

    const handlePlot = () => {
        if (openPlot) {
            setOpenPlot(false);
        } else {
            setOpenPlot(true);
        }
    }

    const handleArea = (text) => {
        setArea(text);
    }


    useEffect(() => {
        fetchFarm();
        fetchPlot();
        fetchVehicle();
        fetchDailyEntry();
        setDate1(formattedDate);
        // console.log('email:', email);
        if (data.deal === 'self') {
            setSelf(true);
            setContract(false);
        } else if (data.deal === 'contract') {
            setContract(true);
            setSelf(false);
        }
        if (data?.time?.includes('to')) {
            setDuration(false);
            const [start, end] = data.time.split(" to ");
            setStart(start.trim());
            setEnd(end.trim());
        } else {
            setDuration(true);
            setDurationPeriod(data.time);
        }

        if (data.mean === 'tractor') {
            setManPower(false);
            setDiesel(data.fuel);
        } else {
            setManPower(true);
            setPersons(data.person);
        }
    }, [length]);

    return (
        <ScrollView contentContainerStyle={{ width: '100%', flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }} showsVerticalScrollIndicator={false}>
            <View style={{
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white'
            }}>
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginLeft: '10%'
                }}>
                    <View style={{
                        width: '30%'
                    }}>
                        <Inputform2 heading="Code" value={length.toString()} onChange={handleLength} />
                    </View>
                    <View style={{
                        width: '60%',
                        paddingLeft: '15%'
                    }}>
                        <Inputform2 heading="Date" value={date1} onChange={handleDate} />
                    </View>
                </View>
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        width: '45%'
                    }}>
                        <Inputform heading="Farm" text={farmName} onPress={() => { handleFarm() }} openDrop={openFarm} Dropdown={farmData()} />
                    </View>
                    <View style={{
                        width: '45%'
                    }}>
                        <Inputform heading="Plot" text={block + plot} onPress={() => { handlePlot() }} openDrop={openPlot} Dropdown={plotInfo()} />
                    </View>
                </View>
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '2%'
                }}>
                    <View style={{
                        width: '45%'
                    }}>
                        <Inputform2 heading="Area" value={area} onChange={handleArea} />
                    </View>
                    <View style={{
                        width: '45%'
                    }}>
                        <Inputform heading="Stage" text={stage} onPress={() => { handleStage() }} openDrop={openStage} Dropdown={stageData()} />
                    </View>
                </View>
                {stage === 'land preparation' && <View style={{
                    width: '100%',
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: '2%',
                    }}>
                        <View style={{
                            width: '45%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // marginLeft:'0%'
                        }}>
                            <Inputform heading="Sub-Stage" text={subStage} onPress={() => { handleSubStage() }} openDrop={openSubStage} Dropdown={substageData()} />
                        </View>
                        <View style={{
                            width: '20%',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '5%',
                            marginRight: '5%',
                        }}>
                            <Pressable style={{
                                flexDirection: 'row',
                            }} onPress={() => {
                                setSelf(true);
                                setContract(false);
                            }}>
                                <View style={{
                                    height: 20,
                                    width: 20,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    backgroundColor: self ? 'black' : 'white'
                                }} />
                                <Text
                                    style={{
                                        paddingLeft: 10
                                    }}>self</Text>
                            </Pressable>
                        </View>
                        <View style={{
                            width: '20%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: '2%',
                            marginRight: '5%',
                            marginTop: '2%'
                        }}>
                            <Pressable style={{
                                flexDirection: 'row',
                            }} onPress={() => {
                                setContract(true);
                                setSelf(false);
                            }}>
                                <View style={{
                                    height: 20,
                                    width: 20,
                                    borderWidth: 1,
                                    borderRadius: 20,
                                    borderColor: 'black',
                                    backgroundColor: contract ? 'black' : 'white'
                                }} />
                                <Text
                                    style={{
                                        paddingLeft: 10
                                    }}>contract</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10
                    }}>
                        <View style={{
                            width: '30%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 10,
                        }}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setDuration(false);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: duration === false ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Time</Text>
                                </Pressable>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setDuration(true);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: duration ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Duration</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{
                            width: '40%'
                        }}>
                            {duration ?
                                <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <View style={{ width: '70%' }}>
                                        <Inputform2 heading="Duration" value={durationPeriod} onChange={handleDurationPeriod} />
                                    </View>
                                    <View style={{ width: '30%' }}>
                                        <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>hrs</Text>
                                    </View>
                                </View>
                                : <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <View style={{ width: '50%' }}>
                                        <Inputform2 heading="start" value={start} onChange={handleStart} />
                                    </View>
                                    <View style={{ width: '50%' }}>
                                        <Inputform2 heading="end" value={end} onChange={handleEnd} />
                                    </View>
                                </View>}
                        </View>
                        {self && <View style={{
                            width: '20%'
                        }}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setManPower(false);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: manpower === false ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Tractor</Text>
                                </Pressable>
                            </View>
                        </View>}
                    </View>
                    {self && <View style={{
                        width: '30%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: '0%'
                    }}>
                        <Inputform2 heading="Diesel" value={diesel} onChange={handleDiesel} />
                        <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>litre</Text>
                    </View>}
                </View>
                }
                {stage === 'fertilizer' && <View style={{
                    width: '100%',
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingTop: 10
                    }}>
                        <View style={{
                            width: '45%'
                        }}>
                            <Inputform heading="Sub-Stage" text={subFertilizer} onPress={() => { handleSubFertilizer() }} openDrop={openSubFertilizer} Dropdown={subfertilizerData()} />
                        </View>
                        <View style={{
                            width: '45%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // borderWidth:1
                        }}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginRight: '5%'
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setManPower(true);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: manpower ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: '5%',
                                        }}>Man Power</Text>
                                </Pressable>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                                marginLeft: '32%'
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setManPower(false);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: manpower === false ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Tractor</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    {manpower && <View style={{
                        width: '40%',
                    }}>
                        <Inputform2 heading="Persons" value={persons.toString()} onChange={handlePerson} />
                    </View>}
                    {manpower === false && <View style={{
                        width: '30%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 30
                    }}>
                        <Inputform2 heading="Diesel" value={diesel} onChange={handleDiesel} />
                        <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>litre</Text>
                    </View>}
                </View>}
                {stage === 'weedicides' && <View style={{
                    width: '100%',
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingTop: 10
                    }}>
                        <View style={{
                            width: '40%'
                        }}>
                            <Inputform heading="Sub-Stage" text={subWeedicides} onPress={() => { handleSubWeedicides() }} openDrop={openSubWeedicides} Dropdown={subWeedicidesData()} />
                        </View>
                        <View style={{
                            width: '20%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Inputform2 heading="Qty" value={qty} onChange={handleQty} />
                        </View>
                        <View style={{
                            width: '20%'
                        }}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                                marginTop: '25%'
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setManPower(false);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: manpower === false ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Tractor</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10
                    }}>
                        <View style={{
                            width: '30%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 30
                        }}>
                            <Inputform2 heading="Diesel" value={diesel} onChange={handleDiesel} />
                            <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>litre</Text>
                        </View>
                        <View style={{
                            width: '40%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                        }}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setDuration(false);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: duration === false ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Time</Text>
                                </Pressable>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setDuration(true);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: duration ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Duration</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        width: '50%',
                        marginLeft: '15%'
                    }}>
                        {duration ?
                            <View style={{ width: '100%', flexDirection: 'row' }}>
                                <View style={{ width: '70%' }}>
                                    <Inputform2 heading="Duration" value={durationPeriod} onChange={handleDurationPeriod} />
                                </View>
                                <View style={{ width: '30%' }}>
                                    <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>hrs</Text>
                                </View>
                            </View>
                            : <View style={{ width: '100%', flexDirection: 'row' }}>
                                <View style={{ width: '50%' }}>
                                    <Inputform2 heading="start" value={start.toString()} onChange={handleStart} />
                                </View>
                                <View style={{ width: '50%' }}>
                                    <Inputform2 heading="end" value={end.toString()} onChange={handleEnd} />
                                </View>
                            </View>}
                    </View>
                </View>
                }
                {stage === 'sowing' && <View style={{
                    width: '100%',
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingTop: 10,
                        marginRight: '5%'
                    }}>
                        <View style={{
                            width: '47%'
                        }}>
                            <Inputform heading="Sowing-type" text={subsowing} onPress={() => { handleSubSowing() }} openDrop={openSubSowing} Dropdown={subSowingData()} />
                        </View>
                        <View style={{
                            width: '25%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 10
                        }}>
                            <Pressable style={{
                                flexDirection: 'row'
                            }} onPress={() => {
                                setSelf(true);
                                setContract(false);
                            }}>
                                <View style={{
                                    height: 20,
                                    width: 20,
                                    borderWidth: 1,
                                    borderRadius: 20,
                                    backgroundColor: self ? 'black' : 'white'
                                }} />
                                <Text
                                    style={{
                                        paddingLeft: 10
                                    }}>self</Text>
                            </Pressable>
                        </View>
                        <View style={{
                            width: '20%',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 10
                        }}>
                            <Pressable style={{
                                flexDirection: 'row'
                            }} onPress={() => {
                                setContract(true);
                                setSelf(false);
                            }}>
                                <View style={{
                                    height: 20,
                                    width: 20,
                                    borderWidth: 1,
                                    borderRadius: 20,
                                    backgroundColor: contract ? 'black' : 'white'
                                }} />
                                <Text
                                    style={{
                                        paddingLeft: 10
                                    }}>contract</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10,
                        marginRight: '15%'
                    }}>
                        <View style={{
                            width: '45%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 10,
                        }}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setDuration(false);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: duration === false ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Time</Text>
                                </Pressable>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setDuration(true);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: duration ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Duration</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{
                            width: '20%'
                        }}>
                            {duration ?
                                <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <View style={{ width: '100%' }}>
                                        <Inputform2 heading="Duration" value={durationPeriod} onChange={handleDurationPeriod} />
                                    </View>
                                    <View style={{ width: '30%' }}>
                                        <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>hrs</Text>
                                    </View>
                                </View>
                                : <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <View style={{ width: '100%' }}>
                                        <Inputform2 heading="start" value={start} onChange={handleStart} />
                                    </View>
                                    <View style={{ width: '100%' }}>
                                        <Inputform2 heading="end" value={end} onChange={handleEnd} />
                                    </View>
                                </View>}
                        </View>
                    </View>
                    <View style={{
                        width: '40%'
                    }}>
                        <Inputform2 heading="Persons" value={persons.toString()} onChange={handlePerson} />
                    </View>
                </View>
                }
                {stage === 'irrigation' && <View style={{
                    width: '100%',
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        // paddingTop:10, 
                        marginRight: '0%'
                    }}>
                        <View style={{
                            width: '47%'
                        }}>
                            <Inputform heading="Sources" text={subIrrigation} onPress={() => { handleSubIrrigation() }} openDrop={openSubIrrigation} Dropdown={subIrrigationData()} />
                        </View>
                        {subIrrigation === 'canal' && <View style={{
                            width: '47%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Inputform2 heading="Moga" value={moga} onChange={handleMoga} />
                        </View>}
                        {subIrrigation === 'china engine' && <View style={{
                            width: '40%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 30,
                        }}>
                            <Inputform2 heading="Diesel" value={diesel} onChange={handleDiesel} />
                            <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>litre</Text>
                        </View>}
                        {subIrrigation === 'electric turbine' && <View style={{
                            width: '40%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 30
                        }}>
                            <Inputform2 heading="Units" value={unit} onChange={handleUnit} />
                            <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>units</Text>
                        </View>}
                    </View>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10
                    }}>
                        <View style={{
                            width: '40%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                        }}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setDuration(false);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: duration === false ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Time</Text>
                                </Pressable>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setDuration(true);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: duration ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Duration</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{
                            width: '45%',
                            marginLeft: '5%'
                        }}>
                            {duration ?
                                <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <View style={{ width: '70%' }}>
                                        <Inputform2 heading="Duration" value={durationPeriod} onChange={handleDurationPeriod} />
                                    </View>
                                    <View style={{ width: '30%' }}>
                                        <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>hrs</Text>
                                    </View>
                                </View>
                                : <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <View style={{ width: '50%' }}>
                                        <Inputform2 heading="start" value={start.toString()} onChange={handleStart} />
                                    </View>
                                    <View style={{ width: '50%' }}>
                                        <Inputform2 heading="end" value={end.toString()} onChange={handleEnd} />
                                    </View>
                                </View>}
                        </View>
                    </View>
                </View>
                }
                {stage === 'pesticides' && <View style={{
                    width: '100%',
                    // padding:10, 
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingTop: 10
                    }}>
                        <View style={{
                            width: '45%'
                        }}>
                            <Inputform heading="Sub-Stage" text={subPesticides} onPress={() => { handlePesticides() }} openDrop={openSubPesticides} Dropdown={subPesticidesData()} />
                        </View>
                        <View style={{
                            width: '20%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Inputform2 heading="Qty" value={qty} onChange={handleQty} />
                        </View>
                    </View>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10
                    }}><View style={{
                        width: '37%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setManPower(true);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: manpower ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Man Power</Text>
                                </Pressable>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setManPower(false);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: manpower === false ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                            color: 'black'
                                        }}>Tractor</Text>
                                </Pressable>
                            </View>
                        </View>
                        {manpower && <View style={{
                            width: '40%'
                        }}>
                            <Inputform2 heading="Persons" value={persons.toString()} onChange={handlePerson} />
                        </View>}
                        {manpower === false && <View style={{
                            width: '30%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 30
                        }}>
                            <Inputform2 heading="Diesel" value={diesel} onChange={handleDiesel} />
                            <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>litre</Text>
                        </View>}
                    </View>
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            width: '40%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                        }}>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setDuration(false);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: duration === false ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Time</Text>
                                </Pressable>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 10,
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row'
                                }} onPress={() => {
                                    setDuration(true);
                                }}>
                                    <View style={{
                                        height: 15,
                                        width: 15,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        marginTop: 3,
                                        backgroundColor: duration ? 'black' : 'white'
                                    }} />
                                    <Text
                                        style={{
                                            paddingLeft: 10,
                                        }}>Duration</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{
                            width: '40%'
                        }}>
                            {duration ?
                                <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <View style={{ width: '70%' }}>
                                        <Inputform2 heading="Duration" value={durationPeriod} onChange={handleDurationPeriod} />
                                    </View>
                                    <View style={{ width: '30%' }}>
                                        <Text style={{ paddingTop: 20, fontWeight: 'bold', color: 'black' }}>hrs</Text>
                                    </View>
                                </View>
                                : <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <View style={{ width: '50%' }}>
                                        <Inputform2 heading="start" value={start.toString()} onChange={handleStart} />
                                    </View>
                                    <View style={{ width: '50%' }}>
                                        <Inputform2 heading="end" value={end.toString()} onChange={handleEnd} />
                                    </View>
                                </View>}
                        </View>
                    </View>
                </View>
                }
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '60%', paddingTop: 30 }}>
                    <Pressable
                        style={{
                            paddingTop: 30,
                        }}
                        onPress={handleSubmit}>
                        <Text style={{
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
                            fontWeight: '400'
                        }}>Save</Text>
                    </Pressable>
                    <Pressable style={{ paddingTop: 30, }}>
                        <Text onPress={() => navigation.navigate('Search', { email: data.email })}
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
                            }}>Search</Text>
                    </Pressable>
                    {/* <Pressable style={{paddingTop:30, }}>
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
        </Pressable> */}
                </View>
                {loading && (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text>Uploading...</Text>
                    </View>)}
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
        </ScrollView>
    )
}

React.memo(UpdateDailyEntry);