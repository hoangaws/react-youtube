import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import Styles from '../styles';
import Swipeout from 'react-native-swipe-out';
import * as Progress from 'react-native-progress';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../actions';

let { height, width } = Dimensions.get('window');

class Song extends Component {
  state = {
    songImage: "../img/music.jpg",
    downloading: false
  }

  // Vuốt qua trái để delete
  swipeBtns = [{
    text: 'Delete',
    backgroundColor: 'red',
    onPress: () => { this.props.deleteMusic() }
  }]

  //download music
  async downloadMusic(song) {
    this.setState({ downloading: true });
    await this.props.downloadMusic(song, song.pathChanged);
    this.setState({ downloading: false });
  }

  render() {
    // Trong từng item list 
    return this.props.search ? SearchedSong.call(this) : DownloadedSong.call(this)
  }
}


function SearchedSong() {//bài hát chưa download xuống local
  let song = this.props.searchResults[this.props.songIndex];
  return (
    <TouchableOpacity style={Styles.searchSongContainer} onPress={() => this.props.onPress(song.downloaded)}>
      <View style={[Styles.songView, { width: width - 60 }]}>
        <Image
          source={{ uri: this.props.songImage || this.state.songImage }}
          style={Styles.songTitleImage}
        />
        <View style={Styles.songTitleContainer}>
          <Text style={Styles.songArtistText} numberOfLines={1}>{this.props.artistName || "Unknown Artist"}</Text>
          <Text style={Styles.songTitleText} numberOfLines={1}>{this.props.songName || "Unknown Song"}</Text>
        </View>
      </View>
      {renderProgressBar.call(this)}
    </TouchableOpacity>)
}


function DownloadedSong() {//bài hát đã download xuống local rồi
  return (
    <Swipeout
      right={this.swipeBtns}
      backgroundColor='transparent'
      autoClose={true}
    >
      <TouchableOpacity style={Styles.downloadSongContainer} onPress={this.props.onPress}>
        <View style={Styles.songView}>
          <Image
            source={{ uri: (Platform.OS == 'android' ? 'file://' : "") + this.props.songImage || this.state.songImage }}
            style={Styles.songTitleImage}
          />
          <View style={Styles.songTitleContainer}>
            <Text style={Styles.songArtistText} numberOfLines={1}>{this.props.artistName || "Unknown Artist"}</Text>
            <Text style={Styles.songTitleText} numberOfLines={1}>{this.props.songName || "Unknown Song"}</Text>
          </View>
          {renderProgressBar.call(this, true) 
            //download là songs(đã download rồi)
          }
          
        </View>
      </TouchableOpacity>
    </Swipeout>)
}

function renderProgressBar(downloads) {
  let song = this.props[downloads ? 'songs' : 'searchResults'][this.props.songIndex];
  if (song.preparing) {
    return <ActivityIndicator animating={true} size='small' />
  }

  if (song.downloaded && !downloads) {//downloaded đã tải xong
    //!downloads (chưa download ,hay ko phải state songs)
    return (
      <View style={{ width: 60, paddingLeft: 20 }}>
        <Icon name='md-play' size={40} />
      </View>)
  }

  var progress = this.props.progreses[this.props.id];
  if (song.downloading || this.state.downloading) {
    return (<AnimatedCircularProgress
      size={40}
      width={3}
      fill={progress ? progress * 100 : 0}
      tintColor="#00e0ff"
      backgroundColor="#3d5875" />)
  }

  if (downloads) return null;

  return (
    <TouchableOpacity 
      onPress={() => !song.downloading && this.downloadMusic(song)} //
      style={{ width: 60, paddingLeft: 20 }}>
      <Icon name='md-download' size={40} 
        //Icon có hình download ban đầu
      />
    </TouchableOpacity>
  )
}




function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(store) {
  return {
    progreses: store.progreses,
    searchResults: store.searchResults,//state danh sach bài hát search từ mạng
    songs: store.songs//state lưu bài hát ở local
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Song);
