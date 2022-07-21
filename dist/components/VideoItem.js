import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
// @ts-ignore
import Video from 'react-native-video';
const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;
export const VideoItem = ({ videoUri }) => {
    return (<View style={styles.videoContainer}>
            <Video controls paused resizeMode='contain' style={styles.video} source={{ uri: videoUri }}/>
        </View>);
};
const styles = StyleSheet.create({
    video: {
        width: '100%',
        height: '100%',
    },
    videoContainer: {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
    },
});
export default VideoItem;
