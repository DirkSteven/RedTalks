import React from "react";
import { Link } from "react-router-dom";
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
          <p className="text">Don't have an account?<Link to='/Login/Signup' className="text redirect signup"> Sign up here.</Link></p>
        </div>
    );
}

export default LoginForm;