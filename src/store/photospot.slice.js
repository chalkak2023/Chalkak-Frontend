import { createSlice } from '@reduxjs/toolkit';

let photospotSlice = createSlice({
  name: 'photospot',
  initialState: {
    modalName: '',
    show: false,
    lat: 0,
    lng: 0,
    photospot: {}
  },
  reducers: {
    setModalName(state, action) {
      state.modalName = action.payload;
    },
    setShow(state, action) {
      state.show = action.payload;
    },
    setLat(state, action) {
      state.lat = action.payload;
    },
    setLng(state, action) {
      state.lng = action.payload;
    },
    setPhotospot(state, action) {
      state.photospot = action.payload;
    }
  },
});
export let { setModalName, setShow, setLat, setLng, setPhotospot } = photospotSlice.actions;
export default photospotSlice;
