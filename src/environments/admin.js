

const providerMap = {
  local: "이메일 가입",
  naver: "소셜 로그인(네이버)",
  kakao: "소셜 로그인(카카오)",
};

const adminEnvironments = {
  account: {
    ko: '관리자계정',
    getItemPath: '/admin/auth',
    header: ["ID", "계정", "이름", "등록일자", "삭제"],
    transform: [
      (data) => data.id, // ID
      (data) => data.account, // 계정
      (data) => data.responsibility, // 이름
      (data) => new Date(data.createdAt).toLocaleString(), // 등록일자
    ],
  },
  collection: {
    ko: '콜렉션', 
    getItemPath: '/admin/collections',
    header: ["ID", "콜렉션명", "한줄 소개", "키워드", "등록일자", "삭제"],
    transform: [
      (data) => data.id, // ID
      (data) => data.title, // 콜렉션명
      (data) => data.description, // 한줄 소개
      (data) => data.collection_keywords?.map(obj => obj.keyword).join(', ') || "", // 키워드
      (data) => new Date(data.createdAt).toLocaleString(), // 등록일자
    ],
  },
  photospot: {
    ko: '포토스팟', 
    getItemPath: (collectionId) => `/admin/${collectionId}/photospots`,
    header: ["ID", "포토스팟명", "한줄 소개", "등록일자", "삭제"],
    transform: [
      (data) => data.id, // ID
      (data) => data.title, // 포토스팟명
      (data) => data.description, // 한줄 소개
      (data) => new Date(data.createdAt).toLocaleString(), // 등록일자
    ],
  },
  faq: {
    ko: '자주찾는질문', 
    getItemPath: '/admin/faq',
    header: ["ID", "제목", "최초등록일시"],
    transform: [
      (data) => data.id, // ID
      (data) => data.title, // 제목
      (data) => new Date(data.createdAt).toLocaleString(), // 등록일자
    ],
  },
  meetup: {
    ko: '모임', 
    getItemPath: '/admin/meetups',
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
    transform: [
      (data) => data.id, // ID
      (data) => data.title, // 모임명
      (data) => data.content, // 모임내용
      (data) => data.place, // 장소
      (data) => data.schedule, // 모임 날짜 / 시간
      (data) => `${data.joins?.length || 0} / ${data.headcount}`, // 참여인원
      (data) => new Date(data.createdAt).toLocaleString(), // 최초등록일시
    ],
  },
  user: {
    ko: '유저', 
    getItemPath: '/admin/users',
    header: [
      "ID",
      "이메일·소셜ID",,
      "닉네임",
      "가입일시",
      "가입 형태",
      "블락여부",
      "블락"
    ],
    transform: [
      (data) => data.id, // ID
      (data) => data.provider === 'local' ? data.email : data.providerUserId, // "이메일·소셜ID
      (data) => data.username, // 닉네임
      (data) => new Date(data.createdAt).toLocaleString(), // 가입일시
      (data) => providerMap[data.provider], // 가입 형태
      (data) => data.isBlock ? "✔" : "", // 블락 여부
    ],
  },
};

export default adminEnvironments;
