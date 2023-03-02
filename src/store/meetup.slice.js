import { createSlice } from '@reduxjs/toolkit';

/**
 * data = {
 *   id:        모임 PK,
 *   userId:    모임 개최자 PK
 *   title:     모임명,
 *   content:   모임 소개,
 *   place:     모임 장소,
 *   schedule:  모임 날짜,
 *   headcount: 모임 인원 제한,
 *   createdAt: 모임 생성일,
 *   joins: {
 *     userId:  참여한 유저 PK
 *     user: {
 *       email: 참여한 유저 이메일
 *     }
 *   },
 *   user: {
 *     email: 모임 개최자 email
 *   }
 * }
 */
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
