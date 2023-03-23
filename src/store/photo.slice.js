import { createSlice } from '@reduxjs/toolkit';


/**
 * data = {
 *   userPhoto: 사용자가 클릭한 사진 정보
 *   recommendPhoto: 사용자가 클릭한 사진에 대한 추천 사진정보 리스트
 * }
 */
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