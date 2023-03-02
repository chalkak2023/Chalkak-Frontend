import { createSlice } from '@reduxjs/toolkit';

let photospotModal = createSlice({
  name: 'photospotModal',
  initialState: {
    modalName: '',
    show: false,
    lat: 0,
    lng: 0,
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
    }
  },
});
export let { setModalName, setShow, setLat, setLng } = photospotModal.actions;
export default photospotModal;
