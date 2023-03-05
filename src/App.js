import { Routes, Route } from 'react-router-dom';
import Main from './routes/Main';
import SampleList from './routes/sample/List';
import MeetupsList from './routes/meetups/MeetupsList';
import Header from './routes/components/Header';
import NavSideBar from './routes/components/NavSideBar';
import NaverLogin from './routes/oauth/NaverLogin';
import KakaoLogin from './routes/oauth/KakaoLogin';

function App() {
  return (
    <div className="App">
      <Header />
      <NavSideBar />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/sample" element={<SampleList />}></Route>
        <Route path="/meetups" element={<MeetupsList />}></Route>
        <Route path="/login/naver" element={<NaverLogin />}></Route>
        <Route path="/login/kakao" element={<KakaoLogin />}></Route>
      </Routes>
    </div>
  );
}

export default App;
