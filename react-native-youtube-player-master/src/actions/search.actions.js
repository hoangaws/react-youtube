import _ from 'underscore';

import * as types from './types';
import * as Utils from '../helpers/utils';
import Config from '../config';

// tìm kiếm bài hát
export function searchSong(query) {
  return async (dispatch) => {
    dispatch(setSearchResults([]));// xóa mảng kết quả search dc về rỗng
    dispatch(setLoading(true));// hiện trạng thái Loading(đang search)
    let res = await fetch(`${Config.SEARCH_API_URL}${query}`);//fetch tới URL theo query truyền vào
    res = await res.json();// chuyển nó sang kiểu json
    res = Utils.filterSearchResults(res);// trả ra 1 mảng kiểu state
    res = await setDownloadedSongs(res);// trả ra 1 mảng kiểu state (set thêm download hay chưa)
    dispatch(setLoading(false));// tắt trạng thái Loading
    return dispatch(setSearchResults(res));// trả về mảng kết quả search dc
  }
}

// dựa vào res(là mảng state) trả ra thêm type là search
export function setSearchResults(res) {
  return {
    type: types.SEARCH,
    res
  }
}

// dựa vào res(là mảng state) trả ra thêm type là loading
function setLoading(res) {
  return {
    type: types.LOADING,
    res
  };
}

//trả về map các song
async function setDownloadedSongs(songs) {
  let downloadedSongs = await Utils.getSongsFromStorage();//get danh sách các bài hát đã download
  return _.map(songs, song => {
    let findedSong = _.findWhere(downloadedSongs, { id: song.id });// kiểm tra xem bài hát với id này có trang danh sách đã download chưa
    if (findedSong) {
      findedSong.downloaded = true;//download rồi thì nút download thay bàng nút play(ở trang search)
      return findedSong;
    }
    return song;
  }
  );
}
