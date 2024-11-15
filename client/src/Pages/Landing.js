import './css/landing.css';
import LoginForm from '../Components/Forms/LoginForm';
import SignupForm from '../Components/Forms/SignupForm';

//const root = ReactDOM.createRoot(document.getElementById('root'));

function Landing() {
  return (
    <div className='container'>
      <img alt='FlavorImg' src=''></img>
      <div className='panel'>
        <LoginForm />
      </div>
    </div>
  );
}

export default Landing;