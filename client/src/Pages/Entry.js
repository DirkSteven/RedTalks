import './css/landing.css';
import { Outlet } from 'react-router-dom';
import coverImg from '../Assets/cover.png';

function Entry() {
  return (
    <div className='formcontainer'>
      <img alt='FlavorImg' src={coverImg}></img>
      <div className='panel'>
        <Outlet/>
      </div>
    </div>
  );
}

export default Entry;