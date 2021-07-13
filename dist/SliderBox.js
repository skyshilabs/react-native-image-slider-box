import React, { Component } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

import Carousel, { Pagination } from "react-native-snap-carousel"; //Thank From distributer(s) of this lib
import styles from "./SliderBox.style";

// -------------------Props---------------------
// images
// onCurrentImagePressed
// sliderBoxHeight
// parentWidth
// dotColor
// inactiveDotColor
// dotStyle
// paginationBoxVerticalPadding
// circleLoop
// autoplay
// ImageComponent
// paginationBoxStyle
// resizeMethod
// resizeMode
// ImageComponentStyle,
// imageLoadingColor = "#E91E63"

const width = Dimensions.get("window").width;

export class SliderBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImage: 0,
      loading: []
    };
    this.onCurrentImagePressedHandler = this.onCurrentImagePressedHandler.bind(
      this
    );
    this.onSnap = this.onSnap.bind(this);
  }
  componentDidMount() {
    let a = [...Array(this.props.images.length).keys()].map(i => false);
  }
  onCurrentImagePressedHandler() {
    if (this.props.onCurrentImagePressed) {
      this.props.onCurrentImagePressed(this.state.currentImage);
    }
  }

  onSnap(index) {
    const { currentImageEmitter } = this.props;
    this.setState({ currentImage: index }, () => {
      if (currentImageEmitter) currentImageEmitter(this.state.currentImage);
    });
  }

  _renderItem({ item, index }) {
    const {
      ImageComponent,
      ImageComponentStyle = {},
      sliderBoxHeight,
      disableOnPress,
      resizeMethod,
      resizeMode,
      imageLoadingColor = "#E91E63"
    } = this.props;

    const isYoutube = item !== null ? item.includes('https://www.youtube.com/watch?') : false
    const youtubeID = isYoutube ? item.replace('https://www.youtube.com/watch?v=', '') : null

    return (
      <View
        style={{
          position: "relative",
          justifyContent: "center"
        }}
      >
        {youtubeID !== null ?
          <View style={{ marginTop: 60 }}>
            <YoutubePlayer
              height={200}
              play={false}
              videoId={youtubeID}
              onChangeState={() => {}}
            />
          </View>
          :
          <TouchableHighlight
            key={index}
            onPress={() => !disableOnPress && this.onCurrentImagePressedHandler()}
          >
            <ImageComponent
              style={[
                {
                  width: "100%",
                  height: sliderBoxHeight || 200,
                  alignSelf: "center"
                },
                ImageComponentStyle
              ]}
              source={typeof item === "string" ? { uri: item } : item}
              resizeMethod={resizeMethod || "resize"}
              resizeMode={resizeMode || "cover"}
              onLoad={() => {}}
              onLoadStart={() => {}}
              onLoadEnd={() => {
                let t = this.state.loading;
                t[index] = true;
                this.setState({ loading: t });
              }}
              {...this.props}
            />
          </TouchableHighlight>
        }
        {!this.state.loading[index] && !isYoutube && (
          <ActivityIndicator
            size="large"
            color={imageLoadingColor}
            style={{
              position: "absolute",
              alignSelf: "center"
            }}
          />
        )}
      </View>
    );
  }

  get pagination() {
    const { currentImage } = this.state;
    const {
      images,
      dotStyle,
      dotColor,
      inactiveDotColor,
      paginationBoxStyle,
      paginationBoxVerticalPadding
    } = this.props;
    return (
      <Pagination
        borderRadius={2}
        dotsLength={images.length}
        activeDotIndex={currentImage}
        dotStyle={dotStyle || styles.dotStyle}
        dotColor={dotColor || colors.dotColors}
        inactiveDotColor={inactiveDotColor || colors.white}
        inactiveDotScale={0.8}
        carouselRef={this._ref}
        inactiveDotOpacity={0.8}
        tappableDots={!!this._ref}
        containerStyle={[
          styles.paginationBoxStyle,
          paginationBoxVerticalPadding
            ? { paddingVertical: paginationBoxVerticalPadding }
            : {},
          paginationBoxStyle ? paginationBoxStyle : {}
        ]}
        {...this.props}
      />
    );
  }

  render() {
    const {
      images,
      circleLoop,
      autoplay,
      parentWidth,
      loopClonesPerSide
    } = this.props;
    return (
      <View>
        <Carousel
          layout={"default"}
          data={images}
          ref={c => (this._ref = c)}
          loop={circleLoop || false}
          enableSnap={true}
          autoplay={autoplay || false}
          itemWidth={parentWidth || width}
          sliderWidth={parentWidth || width}
          loopClonesPerSide={loopClonesPerSide || 5}
          renderItem={item => this._renderItem(item)}
          onSnapToItem={index => this.onSnap(index)}
          {...this.props}
        />
        {images.length > 1 && this.pagination}
      </View>
    );
  }
}

const colors = {
  dotColors: "#BDBDBD",
  white: "#FFFFFF"
};

SliderBox.defaultProps = {
  ImageComponent: Image
};
