import TodoTemplate from './components/todo/TodoTemplate';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Route, Routes } from 'react-router-dom';
import Login from './components/user/Login';
import Join from './components/user/Join';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './util/AuthContext';

function App() {
  return (
    // 데이터를 전달하고자 하는 자식 컴포넌트들을 Provider로 감쌉니다.
    <AuthContextProvider>
      <div className='wrapper'>
        <Header />
        <div className="content-wrapper">
          <Routes>
            <Route path='/' element={<TodoTemplate />} />
            <Route path='/login' element={<Login />} />
            <Route path='/join' element={<Join />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthContextProvider>
  );
}

export default App;