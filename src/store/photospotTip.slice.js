import { createSlice } from '@reduxjs/toolkit';

const photospotTip = createSlice({
  name: 'photospotTip',
  initialState: {
    show: true,
  },
  reducers: {
    setPhotospotTipShow(state, action) {
      state.show = action.payload;
    },
  },
});
export const { setPhotospotTipShow } = photospotTip.actions;
export default photospotTip;
