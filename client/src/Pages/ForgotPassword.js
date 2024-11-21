import PlainInput from '../Components/Text Input/PlainInput';
import HiddenInput from '../Components/Text Input/HiddenInput';
import './css/landing.css';

function Forgot(){
    return(
        <div className='panelform'>
            <form>
                <PlainInput label="Email Address"/>
                <div className='verify'>
                    <PlainInput label="Verification Code"/>
                    <button id='GetCode'>Get Code</button>
                </div>
                <HiddenInput label="New Password"/>
                <HiddenInput label="Confirm New Passowrd"/>
            </form>
        </div>
    );
}

export default Forgot;