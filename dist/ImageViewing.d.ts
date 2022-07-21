/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ComponentType } from "react";
import { ModalProps } from "react-native";
import { ImageSource, ImageViewingDataType, VideoItemComponentProps } from "./@types";
declare type Props = {
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
    HeaderComponent?: ComponentType<{
        imageIndex: number;
    }>;
    FooterComponent?: ComponentType<{
        imageIndex: number;
    }>;
    VideoItemComponent?: ComponentType<VideoItemComponentProps>;
};
declare const EnhancedImageViewing: (props: Props) => JSX.Element;
export default EnhancedImageViewing;
