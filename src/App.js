import './App.css';
import AllPosts from './Components/AllPosts';
import { Route, Routes } from 'react-router-dom';
import Layout from './Components/layout';
import RegisterPage from './Components/login/register';
import LoginPage from './Components/login/login';
import { UserContextProvider } from './UserContext';
import Create from './Components/Actions/Create';
import Update from './Components/Actions/Edit';
import PostPage from './Components/PostPage';
import Edit from './Components/Actions/Edit';

export default function App() {
  return (
    
      <UserContextProvider>

        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<AllPosts />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />}/>
          <Route path="/create" element={<Create />}/>
          <Route path="/update" element={<Update />}/>
          <Route path="/postPage/:id" element={<PostPage />}/>
          <Route path="/edit/:id" element={<Edit />}/>

          </Route>
          {/* <Route path="/register" element={<div>Register page</div>} /> */}
        </Routes>
      </UserContextProvider>


    
  );
}


