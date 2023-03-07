import { createSlice } from '@reduxjs/toolkit';

let collection = createSlice({
  name: 'collection',
  initialState: {
    data: {},
  },
  reducers: {
    setCollection(state, action) {
      state.data = action.payload;
    },
  },
});
export let { setCollection } = collection.actions;
export default collection;
