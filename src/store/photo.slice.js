import { createSlice } from '@reduxjs/toolkit';

let photo = createSlice({
  name: 'photo',
  initialState: {
    data: {},
  },
  reducers: {
    setPhoto(state, action) {
      state.data = action.payload;
    },
  },
});
export let { setPhoto } = photo.actions;
export default photo;