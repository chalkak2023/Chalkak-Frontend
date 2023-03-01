import { createSlice } from '@reduxjs/toolkit';

let nav = createSlice({
  name: 'nav',
  initialState: {
    show: false,
  },
  reducers: {
    setNavShow(state, action) {
      state.show = action.payload;
    },
  },
});
export let { setNavShow } = nav.actions;
export default nav;
