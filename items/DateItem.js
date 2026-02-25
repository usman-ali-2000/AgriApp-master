import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import DatePickerCalendar from "./DatePickerComponent";

export default function DateItem({
    label = "Date",
    value,
    onChange,
    borderWidth = 1,
    placeholder = "Select date",
}) {
    const [showCal, setCal] = useState(false);

    return (
        <View style={styles.wrapper}>
            {/* Label */}
            <Text style={styles.label}>{label}</Text>

            {/* Date display */}
            <TouchableOpacity
                style={[styles.container, { borderWidth }]}
                onPress={() => setCal(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.valueText, !value && styles.placeholder]}>
                    {value || placeholder}
                </Text>
            </TouchableOpacity>

            {/* Modal for Calendar */}
            <Modal
                visible={showCal}
                transparent
                animationType="fade"
                onRequestClose={() => setCal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setCal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <DatePickerCalendar
                                    selectedDate={value}
                                    onSelectDate={(date) => {
                                        // If `date` comes as "DD/MM/YYYY" or a Date object
                                        const d = new Date(date);

                                        const day = d.getDate();          // 1-31
                                        const month = d.getMonth() + 1;   // 1-12, single digit
                                        const year = d.getFullYear();

                                        // Single digit month format
                                        const formatted = `${day}/${month}/${year}`;

                                        onChange?.(formatted); // pass formatted date to parent
                                        setCal(false);         // close modal
                                    }}
                                    markedColor="orange"
                                    showCal={showCal}
                                    setShowCal={setCal}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 10,
    },
    label: {
        fontWeight: "600",
        color: "#333",
        marginBottom: 6,
    },
    container: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: 'lightgrey',
        height: 44,
        borderColor: 'lightblue',
        paddingHorizontal: 12,
    },
    valueText: {
        color: "#111",
        fontSize: 14,
    },
    placeholder: {
        color: "#999",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)", // dark transparent background
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        width: "90%",
        elevation: 5,
    },
});