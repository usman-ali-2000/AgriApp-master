import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function DatePickerCalendar({
    selectedDate,
    onSelectDate,
    markedColor = 'orange',
    disabled = false,
    showCal,
    setShowCal,
}) {
    return (
        <View>
            {showCal && <Calendar
                style={{
                    borderColor: 'gray',
                    // height: 350
                }}
                onDayPress={day => {
                    onSelectDate(day.dateString);
                    setShowCal(false);
                }}
                markedDates={{
                    [selectedDate]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedDotColor: markedColor
                    }
                }}
                disabledByDefault={disabled}
            />}
        </View>
    );
}
