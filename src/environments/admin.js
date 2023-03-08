const providerMap = {
  local: "이메일 가입",
  naver: "소셜 로그인(네이버)",
  kakao: "소셜 로그인(카카오)",
};

const adminEnvironments = {
  account: {
    itemPerPage: 6,
    header: ["ID", "계정", "이름", "등록일자", "삭제"],
    width: [10, 30, 30, 20, 10],
    transform: [
      (data) => data.id, // ID
      (data) => data.account, // 계정
      (data) => data.responsibility, // 이름
      (data) => data.createdAt, // 등록일자
    ],
  },
  collection: {
    itemPerPage: 6,
    header: ["ID", "콜렉션명", "한줄 소개", "키워드", "등록일자", "삭제"],
    width: [10, 20, 20, 20, 20, 10],
    transform: [
      (data) => data.id, // ID
      (data) => data.title, // 콜렉션명
      (data) => data.description, // 한줄 소개
      (data) => data.collection_keywords || "", // (백엔드 필요) 키워드
      (data) => data.createdAt, // 등록일자
    ],
  },
  faq: {
    itemPerPage: 6,
    header: ["ID", "제목", "최초등록일시", "삭제"],
    width: [10, 65, 15, 10],
    transform: [
      (data) => data.id, // ID
      (data) => data.title, // 제목
      (data) => data.createdAt, // 등록일자
    ],
  },
  meetup: {
    itemPerPage: 6,
    header: [
      "ID",
      "모임명",
      "모임내용",
      "장소",
      "모임 날짜 / 시간",
      "참여인원",
      "최초등록일시",
      "삭제"
    ],
    width: [10, 20, 20, 10, 10, 10, 10, 10],
    transform: [
      (data) => data.id, // ID
      (data) => data.title, // 모임명
      (data) => data.content, // 모임내용
      (data) => data.place, // 장소
      (data) => data.schedule, // 모임 날짜 / 시간
      (data) => `0 / ${data.headcount}`, // 참여인원
      (data) => data.createdAt, // 최초등록일시
    ],
  },
  user: {
    itemPerPage: 6,
    header: [
      "ID",
      "이메일",
      "가입일시",
      "가입 형태",
      "소셜ID",
      "블락여부",
      "블락"
    ],
    width: [10, 20, 20, 15, 20, 5, 10],
    transform: [
      (data) => data.id, // ID
      (data) => data.email, // 이메일
      (data) => data.createdAt, // 가입일시
      (data) => providerMap[data.provider], // 가입 형태
      (data) => data.providerUserId, // 소셜 ID
      (data) => data.isBlock ? "✔" : "", // 블락 여부
    ],
  },
};

export default adminEnvironments;
