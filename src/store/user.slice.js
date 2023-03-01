import { createSlice } from '@reduxjs/toolkit';

let user = createSlice({
  name: 'user',
  initialState: {
    data: {},
  },
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
    },
  },
});
export let { setUser } = user.actions;
export default user;
