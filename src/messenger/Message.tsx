import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { Icon, Text, Image } from '../components'
import { Timestamp } from '../database/Firebase'

interface MessageProps {
    authorName: string
    photoURL?: string
    id: string
    message: string
    postedAt: Timestamp
}

interface Props {
    item: MessageProps
}

export default class Message extends PureComponent<Props> {
    private item: MessageProps
    private date: string
    private time: string

    constructor(props: Props) {
        super(props)
        this.item = props.item
        this.date = (this.item.postedAt
            ? this.item.postedAt.toDate()
            : new Date()
        ).toLocaleDateString()
        this.time = (this.item.postedAt
            ? this.item.postedAt.toDate()
            : new Date()
        ).toLocaleTimeString()
    }

    static readonly iconSize = 32;

    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                { this.item.photoURL ? (
                    <Image
                        source={{ uri: this.item.photoURL }}
                        style={{ width: Message.iconSize, height: Message.iconSize, borderRadius: (Message.iconSize / 2) }}
                    />
                ) : (
                    <Icon
                        type='material'
                        name='face'
                        size={Message.iconSize}
                    />
                )}
                <View key={this.item.id} style={{ paddingLeft: 5, paddingVertical: 5 }}>
                    <Text fontSize={12} fontWeight="100">
                        {`${this.item.authorName} [ ${this.date} @ ${this.time} ] `}
                    </Text>
                    <Text fontSize={14} fontWeight="400">
                        {this.item.message}
                    </Text>
                </View>
            </View>
        )
    }
}
