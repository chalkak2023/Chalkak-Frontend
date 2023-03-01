import { createSlice } from '@reduxjs/toolkit';

let meetup = createSlice({
  name: 'meetup',
  initialState: {
    data: {},
  },
  reducers: {
    setMeetup(state, action) {
      state.data = action.payload;
    },
  },
});
export let { setMeetup } = meetup.actions;
export default meetup;
