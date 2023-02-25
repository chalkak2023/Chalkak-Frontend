import { createSlice } from '@reduxjs/toolkit';

let modal = createSlice({
  name: 'modal',
  initialState: {
    modalName: '',
    show: false,
  },
  reducers: {
    setModalName(state, action) {
      state.modalName = action.payload;
    },
    setShow(state, action) {
      state.show = action.payload;
    },
  },
});
export let { setModalName, setShow } = modal.actions;
export default modal;
