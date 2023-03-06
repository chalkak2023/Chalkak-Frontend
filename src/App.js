import { Routes, Route } from 'react-router-dom';
import Main from './routes/Main';
import SampleList from './routes/sample/List';
import MeetupsList from './routes/meetups/MeetupsList';
import Header from './routes/components/Header';
import NavSideBar from './routes/components/NavSideBar';
import NaverLoginRedirect from './routes/oauth/NaverLoginRedirect';
import KakaoLoginRedirect from './routes/oauth/KakaoLoginRedirect';
import Photospot from './routes/Photospot/Photospot';
import PhotospotView from './routes/Photospot/PhotospotView';
import Auth from './routes/hoc/auth'

function App() {
  const AuthPhotospot = Auth(Photospot);

  return (
    <div className="App">
      <Header />
      <NavSideBar />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/sample" element={<SampleList />}></Route>
        <Route path="/meetups" element={<MeetupsList />}></Route>
        <Route path="/photospot" element={<AuthPhotospot />}></Route>
        <Route path="/photospot-view" element={<PhotospotView />}></Route>
        <Route path="/login/naver" element={<NaverLoginRedirect />}></Route>
        <Route path="/login/kakao" element={<KakaoLoginRedirect />}></Route>
      </Routes>
    </div>
  );
}

export default App;
