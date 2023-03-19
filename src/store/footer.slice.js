import { createSlice } from '@reduxjs/toolkit';

let footer = createSlice({
  name: 'footer',
  initialState: {
    isFooterOn: true
  },
  reducers: {
    setIsFooterOn(state, action) {
      state.isFooterOn = action.payload;
    },
  },
});
export let { setIsFooterOn } = footer.actions;
export default footer;
