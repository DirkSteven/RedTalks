import {BrowserRouter as BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Announcement from './Announcement';
import Marketplace from './Marketplace';

function Main() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path='Announcement' element={<Announcement/>}/>
                <Route path='Marketplace' element={<Marketplace/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default Main;