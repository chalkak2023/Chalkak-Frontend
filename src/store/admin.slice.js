import { createSlice } from '@reduxjs/toolkit';

/**
 * data = {
 *   id:      관리자 PK,
 *   account: 관리자 이메일,
 *   iat:     토큰 발급된 시간,
 *   exp:     토큰 만료 시간
 * }
 */
let admin = createSlice({
  name: 'admin',
  initialState: {
    data: {},
    loginState: false
  },
  reducers: {
    setAdmin(state, action) {
      state.data = action.payload;
    },
    setAdminLogin(state, action) {
      state.admin = action.payload;
    }
  },
});
export let { setAdmin, setAdminLogin } = admin.actions;
export default admin;
