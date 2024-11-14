import './css/homepage.css';
//import * as ReactDOM from 'react-dom';
import LoginForm from '../Components/Forms/LoginForm';
import SignupForm from '../Components/Forms/SignupForm';

//const root = ReactDOM.createRoot(document.getElementById('root'));

function Home() {
  return (
    <div className='container'>
      <img alt='FlavorImg' src=''></img>
      <div className='panel'>
        <SignupForm />
      </div>
    </div>
  );
}

export default Home;