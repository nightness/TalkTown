import React, { useState, useContext, useEffect } from 'react'
import { ScrollView, Platform, StyleProp, TextStyle } from 'react-native'
import { ScreenContext } from './ScreenContext'
import { Picker, PickerIOS } from '@react-native-picker/picker'
// @ts-ignore - No Types found yet
import ToggleBox from 'react-native-togglebox'
import { ItemValue } from '@react-native-picker/picker/typings/Picker'

export interface PickerItem {
    label: string
    value: any
}

interface Props {
    style?: StyleProp<TextStyle>
    data?: PickerItem[]
    selectedIndex?: number
    onValueChanged?: (item?: PickerItem) => void
}

export default ({
    style,
    data = [],
    selectedIndex = 0,
    onValueChanged,
    ...restProps
}: Props) => {
    const { theme } = useContext(ScreenContext)
    const [selectedValue, setSelectedValue] = useState<ItemValue>()
    const [selectedItem, setSelectedItem] = useState<PickerItem>()
    //const properTheme = enabled ? Themes.picker[theme] : Themes.pickerDisabled[theme]

    useEffect(() => {
        setSelectedItem(data?.[selectedIndex])
    }, [data])

    useEffect(() => {
        onValueChanged && onValueChanged(selectedItem)
    }, [selectedItem])

    const PickerCommon = () => (
        <Picker
            style={[Styles.picker.picker, Themes.picker[theme], style]}
            ///itemStyle={[Styles.picker.pickerItem, Themes.pickerItem[theme], style]}            
            {...restProps}
            selectedValue={selectedValue}
            onValueChange={(value, index) => {
                setSelectedValue(value)
                setSelectedItem(data?.[index])
            }}
        >
            {data.map((item) => {
                return (
                    <Picker.Item
                        color={Themes.picker[theme].color}
                        label={item.label} value={item.value} key={item.value}
                    />
                )
            })}
        </Picker>
    )

    return (
        <ScrollView style={[Styles.container.scrollView, Themes.container[theme]]} bounces={false}>
            {Platform.OS === 'ios' && (
                <ToggleBox
                    label={
                        selectedItem && selectedItem.label
                            ? selectedItem.label
                            : selectedItem
                            ? selectedItem
                            : ''
                    }
                    style={Styles.picker.toggleBox}
                >
                    <PickerCommon />
                </ToggleBox>
            )}
            {Platform.OS !== 'ios' && <PickerCommon />}
        </ScrollView>
    )
}
