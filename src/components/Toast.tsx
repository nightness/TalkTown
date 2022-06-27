import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

export interface MessageInfo {
  message: string;
  title: string;
}

export interface MessageProps extends MessageInfo {
  onHide: () => void;
  hideDelay?: number;
  heightCollapseDuration?: number;
  fadeInDuration?: number;
  fadeOutDelay?: number;
}

export const Message = (props: MessageProps) => {
  const {
    hideDelay = 5000,
    fadeOutDelay = 500,
    fadeInDuration = 100,
    heightCollapseDuration = 1500,
  } = props;
  const opacity = useRef(new Animated.Value(0)).current;
  const height = useRef(new Animated.Value(0)).current;
  const ref = useRef<Animated.LegacyRef<View>>();
  const heightRef = useRef<number>(50);

  if (ref.current?.getNode)
    ref.current?.getNode()?.measure((_, __, ___, height) => {
      heightRef.current = height;
    });

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true,
      }),
      Animated.delay(hideDelay),
      Animated.timing(height, {
        toValue: 100,
        duration: heightCollapseDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: fadeOutDelay,
        useNativeDriver: true,
      }),
    ]).start(() => {
      props.onHide();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      ref={ref}
      style={{
        opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [heightRef.current, 0],
            }),
          },
        ],
        // height: height,
        width: '80%',
        maxWidth: '400px',
        marginRight: 15,
        marginBottom: 5,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 4,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
        alignSelf: 'flex-end',
        overflow: 'hidden',
      }}
      collapsable={true}
    >
      <Text style={{ fontWeight: '700', fontSize: 18 }}>{props.title}</Text>
      <Text style={{ fontSize: 14 }}>{props.message}</Text>
    </Animated.View>
  );
};

interface Props {
  messages: string[];
  setMessages: React.Dispatch<React.SetStateAction<string[]>>;
}

export default ({ messages, setMessages }: Props) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 45,
        left: 0,
        right: 0,
      }}
    >
      {messages
        .slice(0)
        .reverse()
        .map((result) => {
          const [title, message] = result.split('`');
          return (
            <Message
              key={result}
              message={message}
              title={title}
              onHide={() => {
                setMessages((messages) =>
                  messages.filter((currentMessage) => currentMessage !== result)
                );
              }}
            />
          );
        })}
    </View>
  );
};
