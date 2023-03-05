import { createSlice } from '@reduxjs/toolkit';

let photopsot = createSlice({
  name: 'photospot',
  initialState: {
    modalName: '',
    show: false,
    lat: 0,
    lng: 0,
    data: {}
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
      state.data = action.payload;
    }
  },
});
export let { setModalName, setShow, setLat, setLng, setPhotospot } = photopsot.actions;
export default photopsot;
