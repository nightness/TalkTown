import React, { PureComponent } from 'react'
import {
    FlatList as NativeFlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ListRenderItem,
    StyleProp,
    ViewStyle,
    LayoutChangeEvent,
} from 'react-native'
import { ScreenContext } from './ScreenContext'
import Container from './Container'

interface Props<T> {
    style?: StyleProp<ViewStyle>
    viewStyle?: StyleProp<ViewStyle>
    data: T[]
    renderItem: ListRenderItem<T>
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
    onStartReached?: () => void
    autoScrollToEnd?: boolean
}

interface State<T> {
    refreshing: boolean
}

class FlatList<T> extends PureComponent<Props<T>, State<T>> {
    static contextType = ScreenContext

    public flatList: React.RefObject<NativeFlatList<T>>

    constructor(props: Props<T>) {
        super(props)
        this.state = {
            refreshing: false,
        }
        this.flatList = React.createRef<NativeFlatList<T>>()
    }

    private onFlatListScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset } = e.nativeEvent

        if (contentOffset.y === 0 && this.props.onStartReached)
            this.props.onStartReached()
        if (this.props.onScroll) this.props.onScroll(e)
    }

    private onContentSizeChange = (w: number, h: number) => {
        if (this.props.autoScrollToEnd && !this.state.refreshing)
            this.flatList.current?.scrollToEnd({ animated: false })
    }

    private onLayout = (layout: LayoutChangeEvent) => {
        if (this.props.autoScrollToEnd && !this.state.refreshing)
            this.flatList.current?.scrollToEnd({ animated: false })
    }

    private onRefresh = () => {
        //console.log(e)
    }

    render() {
        return (
            <Container style={this.props.viewStyle}>
                <NativeFlatList
                    style={this.props.style}                
                    ref={this.flatList}
                    renderItem={this.props.renderItem}
                    refreshing={this.state.refreshing}
                    removeClippedSubviews={true}
                    data={this.props.data}
                    onLayout={this.onLayout}
                    onContentSizeChange={this.onContentSizeChange}
                    onRefresh={this.onRefresh}
                    onScroll={this.onFlatListScroll}
                />
            </Container>            
        )
    }
}

export default FlatList
