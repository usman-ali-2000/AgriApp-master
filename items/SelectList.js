import { useState } from 'react';
import { View, Text, Pressable, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';

const SelectList = ({
    data = [],
    labelKey = 'label',
    placeholder = 'Select item',
    value = null,
    heading = null,
    onChange = () => { },
    icon = require('../assets/down.png')
}) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={{ width: '100%' }}>
            {/* Trigger */}
            <Text style={{ width: '100%', fontSize: 15, color: 'black', paddingBottom:'5%' }}>{heading ? heading : ''}</Text>
            <Pressable onPress={() => setOpen(!open)}>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingTop: 8,
                        paddingRight: 10,
                        height: 40,
                        backgroundColor: 'lightgrey',
                        borderRadius: 8,
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            width: '80%',
                            color: value ? 'black' : '#666',
                            paddingLeft: '5%'
                        }}
                    >
                        {value ? value[labelKey] : placeholder}
                    </Text>

                    <Image
                        source={icon}
                        style={{
                            height: 15,
                            width: 15,
                            marginLeft: 10,
                            transform: [{ rotate: open ? '180deg' : '0deg' }]
                        }}
                    />
                </View>
            </Pressable>

            {/* Dropdown */}
            {open && (
                <View
                    style={{
                        marginTop: 6,
                        backgroundColor: '#fff',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#ddd',
                        maxHeight: 100
                    }}
                >
                    <ScrollView nestedScrollEnabled>
                        <FlatList
                            data={data}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onChange(item);
                                        setOpen(false);
                                    }}
                                >
                                    <View
                                        style={{
                                            padding: 10,
                                            borderBottomWidth: 1,
                                            borderColor: '#eee'
                                        }}
                                    >
                                        <Text style={{ color: '#000' }}>
                                            {item[labelKey]}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default SelectList;