import { Routes, Route } from 'react-router-dom';
import Main from './routes/Main';
import SampleList from './routes/sample/List';
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

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UserPage MainComponent={Main} />}></Route>
        <Route path="/sample" element={<UserPage MainComponent={SampleList} />}></Route>
        <Route path="/meetups" element={<UserPage MainComponent={MeetupsList} />}></Route>
        <Route path="/photospot" element={<UserPage MainComponent={Auth(Photospot)} />}></Route>
        <Route path="/photospot-view" element={<UserPage MainComponent={PhotospotView}/>}></Route>
        <Route path="/login/:provider" element={<OauthLoginRedirect />}></Route>
        <Route path="/collections" element={<UserPage MainComponent={CollectionsList} />}></Route>
        <Route path="/admin" element={<AdminPage MainComponent={AdminMain} />}></Route>
        <Route path="/admin/users" element={<AdminPage MainComponent={AdminUser} />}></Route>
        <Route path="/admin/collections" element={<AdminPage MainComponent={AdminCollection} />}></Route>
        <Route path="/admin/collections/:collectionId/photospots" element={<AdminPage MainComponent={AdminPhotospot} />}></Route>
        <Route path="/admin/meetups" element={<AdminPage MainComponent={AdminMeetup} />}></Route>
        <Route path="/admin/faqs" element={<AdminPage MainComponent={AdminFAQ} />}></Route>
        <Route path="/admin/accounts" element={<AdminPage MainComponent={AdminAccount} />}></Route>
        <Route path="/service" element={<UserPage MainComponent={Service} />}></Route>
      </Routes>
    </div>
  );
}

export default App;
