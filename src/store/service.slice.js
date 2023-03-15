import { createSlice } from '@reduxjs/toolkit';

let serviceFaq = createSlice({
  name: 'serviceFaq',
  initialState: {
    data: {},
  },
  reducers: {
    setServiceFaq(state, action) {
      state.data = action.payload;
    },
  },
});
export let { setServiceFaq } = serviceFaq.actions;
export default serviceFaq;
