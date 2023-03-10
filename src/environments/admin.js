const providerMap = {
  local: "이메일 가입",
  naver: "소셜 로그인(네이버)",
  kakao: "소셜 로그인(카카오)",
};

const adminEnvironments = {
  account: {
    ko: '관리자계정',
    getItemPath: '/admin/auth',
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
    ko: '콜렉션', 
    getItemPath: '/admin/collections',
    itemPerPage: 6,
    header: ["ID", "콜렉션명", "한줄 소개", "키워드", "등록일자", "삭제"],
    width: [10, 20, 20, 20, 20, 10],
    transform: [
      (data) => data.id, // ID
      (data) => data.title, // 콜렉션명
      (data) => data.description, // 한줄 소개
      (data) => data.collection_keywords?.map(obj => obj.keyword).join(', ') || "", // 키워드
      (data) => data.createdAt, // 등록일자
    ],
  },
  photospot: {
    ko: '포토스팟', 
    getItemPath: (collectionId) => `/admin/${collectionId}/photospots`,
    header: ["ID", "포토스팟명", "한줄 소개", "등록일자", "삭제"],
    width: [10, 20, 50, 10, 10],
    transform: [
      (data) => data.id, // ID
      (data) => data.title, // 포토스팟명
      (data) => data.description, // 한줄 소개
      (data) => data.createdAt, // 등록일자
    ],
  },
  faq: {
    ko: '자주찾는질문', 
    getItemPath: '/admin/faq',
    itemPerPage: 6,
    header: ["ID", "제목", "최초등록일시"],
    width: [10, 65, 15, 10],
    transform: [
      (data) => data.id, // ID
      (data) => data.title, // 제목
      (data) => data.createdAt, // 등록일자
    ],
  },
  meetup: {
    ko: '모임', 
    getItemPath: '/admin/meetups',
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
      (data) => `${data.joins?.length || 0} / ${data.headcount}`, // 참여인원
      (data) => data.createdAt, // 최초등록일시
    ],
  },
  user: {
    ko: '유저', 
    getItemPath: '/admin/users',
    itemPerPage: 6,
    header: [
      "ID",
      "소셜ID",
      "이메일",
      "닉네임",
      "가입일시",
      "가입 형태",
      "블락여부",
      "블락"
    ],
    width: [10, 15, 15, 10, 20, 15, 5, 10],
    transform: [
      (data) => data.id, // ID
      (data) => data.providerUserId, // 소셜 ID
      (data) => data.email, // 이메일
      (data) => data.username, // 닉네임
      (data) => data.createdAt, // 가입일시
      (data) => providerMap[data.provider], // 가입 형태
      (data) => data.isBlock ? "✔" : "", // 블락 여부
    ],
  },
};

export default adminEnvironments;
