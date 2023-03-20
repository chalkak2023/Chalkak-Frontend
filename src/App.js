import { Routes, Route } from 'react-router-dom';
import Main from './routes/Main';
import MeetupsList from './routes/meetups/MeetupsList';
import Photospot from './routes/Photospot/Photospot';
import PhotospotView from './routes/Photospot/PhotospotView';
import Auth from './routes/hoc/auth'
import CollectionsList from "./routes/collections/CollectionsList";
import AdminPage from './pages/AdminPage';
import AdminUser from './routes/admin/AdminUser';
import AdminCollection from './routes/admin/AdminCollection';
import AdminFAQ from './routes/admin/AdminFAQ';
import AdminAccount from './routes/admin/AdminAccount';
import AdminMeetup from './routes/admin/AdminMeetup';
import UserPage from './pages/UserPage'
import AdminMain from './routes/admin/AdminMain';
import AdminPhotospot from './routes/admin/AdminPhotospot';
import OauthLoginRedirect from './routes/oauth/OauthLoginRedirect';
import Service from './routes/service/Service'
import NotFound from './routes/NotFound';
import Chat from './routes/chat/Chat';
import './App.css';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UserPage MainComponent={Main} />}></Route>
        <Route path="/meetups" element={<UserPage MainComponent={MeetupsList} />}></Route>
        <Route path="/collection/:collectionId/photospot" element={<UserPage MainComponent={Auth(Photospot)} />}></Route>
        <Route path="/collection/:collectionId/photospot-view" element={<UserPage MainComponent={PhotospotView}/>}></Route>
        <Route path="/login/:provider" element={<OauthLoginRedirect />}></Route>
        <Route path="/collections" element={<UserPage MainComponent={CollectionsList} />}></Route>
        <Route path="/chat" element={<UserPage MainComponent={Chat} />}></Route>
        <Route path="/admin" element={<AdminPage MainComponent={AdminMain} />}></Route>
        <Route path="/admin/users" element={<AdminPage MainComponent={AdminUser} />}></Route>
        <Route path="/admin/collections" element={<AdminPage MainComponent={AdminCollection} />}></Route>
        <Route path="/admin/collections/:collectionId/photospots" element={<AdminPage MainComponent={AdminPhotospot} />}></Route>
        <Route path="/admin/meetups" element={<AdminPage MainComponent={AdminMeetup} />}></Route>
        <Route path="/admin/faqs" element={<AdminPage MainComponent={AdminFAQ} />}></Route>
        <Route path="/admin/accounts" element={<AdminPage MainComponent={AdminAccount} />}></Route>
        <Route path="/service" element={<UserPage MainComponent={Service} />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
