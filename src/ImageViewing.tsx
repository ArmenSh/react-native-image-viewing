/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ComponentType, useCallback, useEffect } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  VirtualizedList,
  ModalProps,
  Modal,
  StatusBar,
} from "react-native";

import ImageItem from "./components/ImageItem/ImageItem";
import ImageDefaultHeader from "./components/ImageDefaultHeader";
import StatusBarManager from "./components/StatusBarManager";

import useAnimatedComponents from "./hooks/useAnimatedComponents";
import useImageIndexChange from "./hooks/useImageIndexChange";
import useRequestClose from "./hooks/useRequestClose";
import { ImageSource, ImageViewingDataType, VideoItemComponentProps } from "./@types";

type Props = {
  data: ImageViewingDataType[];
  keyExtractor?: (item: ImageViewingDataType, index: number) => string;
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  onLongPress?: (image: ImageSource) => void;
  onImageIndexChange?: (imageIndex: number) => void;
  presentationStyle?: ModalProps["presentationStyle"];
  animationType?: ModalProps["animationType"];
  backgroundColor?: string;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  delayLongPress?: number;
  HeaderComponent?: ComponentType<{ imageIndex: number }>;
  FooterComponent?: ComponentType<{ imageIndex: number }>;
  VideoItemComponent?: ComponentType<VideoItemComponentProps>;
};

const DEFAULT_ANIMATION_TYPE = "fade";
const DEFAULT_BG_COLOR = "#000";
const DEFAULT_DELAY_LONG_PRESS = 800;
const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;

function ImageViewing({
  data,
  keyExtractor,
  imageIndex,
  visible,
  onRequestClose,
  onLongPress = () => {},
  onImageIndexChange,
  animationType = DEFAULT_ANIMATION_TYPE,
  backgroundColor = DEFAULT_BG_COLOR,
  presentationStyle,
  swipeToCloseEnabled,
  doubleTapToZoomEnabled,
  delayLongPress = DEFAULT_DELAY_LONG_PRESS,
  HeaderComponent,
  FooterComponent,
  VideoItemComponent,
}: Props) {
  const imageList = React.createRef<VirtualizedList<ImageViewingDataType>>();
  const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose);
  const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN);
  const [
    headerTransform,
    footerTransform,
    toggleBarsVisible,
  ] = useAnimatedComponents();

  useEffect(() => {
    if (onImageIndexChange) {
      onImageIndexChange(currentImageIndex);
    }
  }, [currentImageIndex]);

  const onZoom = useCallback(
    (isScaled: boolean) => {
      // @ts-ignore
      imageList?.current?.setNativeProps({ scrollEnabled: !isScaled });
      toggleBarsVisible(!isScaled);
    },
    [imageList],
  );

  if (!visible) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle='light-content'/>
      <Modal
        transparent={presentationStyle === "overFullScreen"}
        visible={visible}
        presentationStyle={presentationStyle}
        animationType={animationType}
        onRequestClose={onRequestCloseEnhanced}
        supportedOrientations={["portrait"]}
        hardwareAccelerated
      >
        {/* <StatusBarManager presentationStyle={presentationStyle} /> */}
        <View style={[styles.container, { opacity, backgroundColor }]}>
          <Animated.View style={[styles.header, { transform: headerTransform }]}>
            {typeof HeaderComponent !== "undefined"
              ? (
                React.createElement(HeaderComponent, {
                  imageIndex: currentImageIndex,
                })
              )
              : (
                <ImageDefaultHeader onRequestClose={onRequestCloseEnhanced} />
              )}
          </Animated.View>
          <VirtualizedList
            ref={imageList}
            data={data}
            horizontal
            pagingEnabled
            windowSize={2}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            initialScrollIndex={imageIndex}
            getItem={(_, index) => data[index]}
            getItemCount={() => data.length}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            renderItem={({ item: {videoUri, imageSource} }) => videoUri && VideoItemComponent ? (
              React.createElement(VideoItemComponent, {
                imageSource,
                videoUri,
                onRequestHideHeader: onZoom,
              })
            ) : (
              <ImageItem
                onZoom={onZoom}
                imageSrc={imageSource}
                onRequestClose={onRequestCloseEnhanced}
                onLongPress={onLongPress}
                delayLongPress={delayLongPress}
                swipeToCloseEnabled={swipeToCloseEnabled}
                doubleTapToZoomEnabled={doubleTapToZoomEnabled}
              />
            )}
            onMomentumScrollEnd={onScroll}
            // @ts-ignore
            keyExtractor={(item, index) => keyExtractor ? keyExtractor(item, index) : item.imageSource.uri || `${item.imageSrc}`}
          />
          {typeof FooterComponent !== "undefined" && (
            <Animated.View
              style={[styles.footer, { transform: footerTransform }]}
            >
              {React.createElement(FooterComponent, {
                imageIndex: currentImageIndex,
              })}
            </Animated.View>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    top: 0,
  },
  footer: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    bottom: 0,
  },
});

const EnhancedImageViewing = (props: Props) => (
  <ImageViewing key={props.imageIndex} {...props} />
);

export default EnhancedImageViewing;
