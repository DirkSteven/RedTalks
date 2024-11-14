import React from "react";
import Submit from "../Buttons/Submit";
import PlainInput from "../Text Input/PlainInput";
import HiddenInput from "../Text Input/HiddenInput";

function LoginForm () {
    return(
        <div>
          <h1>Login</h1>
          <form>
            <PlainInput label={'Email Address'} />
            <HiddenInput label={'Password'} />
          </form>
          <a href="#" className="text redirect forgot">Forgot Password?</a>
          <Submit label='LOGIN'/>
          <p className="text">Don't have an account?<a href="signup.html" className="text redirect signup"> Sign up here.</a></p>
        </div>
    );
}

export default LoginForm;