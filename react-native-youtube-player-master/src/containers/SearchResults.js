import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../actions';
import Styles from '../styles';
import Song from '../components/Song';
import * as Utils from '../helpers/utils';

class SearchResults extends Component {

  async songClick(data,index, downloaded) {
    if (!downloaded) {
      let song = this.props.searchResults[index];
      try {
        song.preparing = true;
        this.props.setSearchResults([...this.props.searchResults]);
        let songInfo = await Utils.getSongInfo(song.path);
        //Cấu trúc songInfo do getSonginfo trả về 
        // {
        //   "status": true, 
        //   "url": "http://52.232.85.160/ratmkowFc4A"
        // }
        song.path = songInfo.url;
        song.pathChanged = true;
        song.preparing = false;
        this.props.setSearchResults([...this.props.searchResults]);
      } catch (err) {
        console.warn(err);
      }
    }
    this.props.setPlayingSong(index, this.props.searchResults);

  }

  render() {
    //Nếu biến loading(báo hiệu load xong) đang load ->hiện vòng xoay
    // load xong rồi -> hiện dòng chữ "No Search ..."
    let loadingText = this.props.loading ? <ActivityIndicator size="large" animating={true} /> : <Text>No Search Results</Text>;

    return (
      // Nếu có kết quả searchResults -> hiện FlatList
      this.props.searchResults.length ? <FlatList
        style={Styles.fullWidth}
        data={this.props.searchResults}
        renderItem={({ item, index }) => {
          //item từng phần tử trong searchResults
          //index số thứ tự của item trong searchResults ,bắt đầu từ 0
          return (<Song
            onPress={this.songClick.bind(this,item, index)}
            songName={item.title}//Tên bài hát
            artistName={item.artist}//Tiêu đề,tác giả
            songImage={item.thumb}//ảnh
            id={item.id}//id trên youtube
            search={true}
            songIndex={index}// số thứ tự của bài hát trong searchResults , bắt đầu từ 0
          />)
        }}
      /> : (
          //Nếu ko có kết quả searchResults -> đang load hoặc "No Search..."
          <View style={Styles.centerContainer}>
            {loadingText}
          </View>
        )
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(store) {
  return {
    searchResults: store.searchResults,
    loading: store.loading
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
