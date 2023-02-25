import { Routes, Route } from 'react-router-dom';
import Main from './routes/Main';
import SampleList from './routes/sample/List';

function App() {
  return (
    <div className="App">
      <h1>Chalkak 메인페이지 임시</h1>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/sample" element={<SampleList />}></Route>
      </Routes>
    </div>
  );
}

export default App;
