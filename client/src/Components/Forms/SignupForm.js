import React from "react";
import Submit from "../Buttons/Submit";
import PlainInput from "../Text Input/PlainInput";
import HiddenInput from "../Text Input/HiddenInput";

function SignupForm () {
    return(
        <div>
          <h1>Login</h1>
          <form>
            <PlainInput label={'Username'} />
            <PlainInput label={'Email Address'} />
            <HiddenInput label={'Password'} />
            <HiddenInput label={'Confirm Password'}/>
          </form>
          <a href="#" className="text redirect forgot">Forgot Password?</a>
          <Submit label='LOGIN'/>
          <p className="text">Already have an account?<a href="#" className="text redirect signup"> Log in here.</a></p>
        </div>
    );
}

export default SignupForm;