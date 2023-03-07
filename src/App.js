import { Routes, Route } from 'react-router-dom';
import Main from './routes/Main';
import SampleList from './routes/sample/List';
import MeetupsList from './routes/meetups/MeetupsList';
import NaverLoginRedirect from './routes/oauth/NaverLoginRedirect';
import KakaoLoginRedirect from './routes/oauth/KakaoLoginRedirect';
import Photospot from './routes/Photospot/Photospot';
import PhotospotView from './routes/Photospot/PhotospotView';
import Auth from './routes/hoc/auth'
import CollectionsList from "./routes/collections/CollectionsList";
import AdminPage from './routes/hoc/AdminPage';
import AdminUser from './routes/admin/AdminUser';
import AdminCollection from './routes/admin/AdminCollection';
import AdminFAQ from './routes/admin/AdminFAQ';
import AdminAccount from './routes/admin/AdminAccount';
import AdminMeetup from './routes/admin/AdminMeetup';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/sample" element={<SampleList />}></Route>
        <Route path="/meetups" element={<MeetupsList />}></Route>
        <Route path="/photospot" element={Auth(Photospot)}></Route>
        <Route path="/photospot-view" element={<PhotospotView />}></Route>
        <Route path="/login/naver" element={<NaverLoginRedirect />}></Route>
        <Route path="/login/kakao" element={<KakaoLoginRedirect />}></Route>
        <Route path="/collections" element={<CollectionsList />}></Route>
        <Route path="/admin" element={AdminPage(Main)}></Route>
        <Route path="/admin/users" element={AdminUser}></Route>
        <Route path="/admin/collections" element={AdminCollection}></Route>
        <Route path="/admin/meetups" element={AdminMeetup}></Route>
        <Route path="/admin/faqs" element={AdminFAQ}></Route>
        <Route path="/admin/accounts" element={AdminAccount}></Route>
      </Routes>
    </div>
  );
}

export default App;
