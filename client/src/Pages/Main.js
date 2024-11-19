import {BrowserRouter as BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Announcement from './Announcement';
import Marketplace from './Marketplace';
import Entry from './Entry';
import Login from './Login';
import Signup from './Signup';

function Main() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path='Announcement' element={<Announcement/>}/>
                <Route path='Marketplace' element={<Marketplace/>}/>
            </Route>
            <Route path='/Login' element={<Entry/>}>
                <Route index element={<Login/>}></Route>
                <Route path='Signup' element={<Signup/>}></Route>
            </Route>
            <Route path='*'element={<div>Page not found</div>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default Main;