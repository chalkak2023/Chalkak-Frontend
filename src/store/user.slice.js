import { createSlice } from '@reduxjs/toolkit';

/**
 * data = {
 *   id:    유저 PK,
 *   email: 유저 이메일,
 *   role:  유저 역할,
 *   iat:   토큰 발급된 시간,
 *   exp:   토큰 만료 시간
 * }
 */
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
