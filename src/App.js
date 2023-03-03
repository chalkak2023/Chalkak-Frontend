import { Routes, Route } from 'react-router-dom';
import Main from './routes/Main';
import SampleList from './routes/sample/List';
import MeetupsList from './routes/meetups/MeetupsList';
import Header from './routes/components/Header';
import NavSideBar from './routes/components/NavSideBar';
import Photospot from './routes/Photospot/Photospot';

function App() {
  return (
    <div className="App">
      <Header />
      <NavSideBar />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/sample" element={<SampleList />}></Route>
        <Route path="/meetups" element={<MeetupsList />}></Route>
        <Route path="/photospot" element={<Photospot />}></Route>
      </Routes>
    </div>
  );
}

export default App;
