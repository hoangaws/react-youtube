import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../actions';

import Styles from '../styles';
import { Hideo } from 'react-native-textinput-effects';
import SearchResults from './SearchResults';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class Search extends Component {
  state = {
    searchQuery: '',//giá trị ban đầu của searchQuery là rỗng
    page: 'search'
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={[Styles.homeContainer, { paddingBottom: !this.props.songs.length ? 50 : 100 }]}>

          <View style={Styles.searchInputContainer}
             //thanh search màu trắng dùng để nhập
              >
            <Hideo
              iconClass={FontAwesome}
              iconName={'search'}
              iconColor={'white'}
              iconBackgroundColor={'#c8c3c3'}
              inputStyle={{ color: '#464949' }}
              placeholder="Song name"//chữ mờ search
              value={this.state.searchQuery}// giá trị ban đầu của searchQuery là rỗng
              onChangeText={searchQuery => this.setState({ searchQuery })}// khi người dùng nhập thì thay đổi lại searchQuery
              onSubmitEditing={() => this.props.searchSong(this.state.searchQuery)}// gọi hàm search bài hát với chuỗi searchQuery
            />
          </View>


          <SearchResults
              //Hiển thị danh sách search và download
           />

        </View>

      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(store) {
  return {
    songs: store.playlist
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
