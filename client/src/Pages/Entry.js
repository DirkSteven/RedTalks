import './css/landing.css';
import { Outlet } from 'react-router-dom';

function Entry() {
  return (
    <div className='container'>
      <img alt='FlavorImg' src=''></img>
      <div className='panel'>
        <Outlet/>
      </div>
    </div>
  );
}

export default Entry;