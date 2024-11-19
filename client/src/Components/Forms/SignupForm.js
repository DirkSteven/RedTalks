import React from "react";
import { Link } from "react-router-dom";
import Submit from "../Buttons/Submit";
import PlainInput from "../Text Input/PlainInput";
import HiddenInput from "../Text Input/HiddenInput";

function SignupForm () {
    return(
        <div>
          <h1>SIGNUP</h1>
          <form>
            <PlainInput label={'Username'} />
            <PlainInput label={'Email Address'} />
            <HiddenInput label={'Password'} />
            <HiddenInput label={'Confirm Password'}/>
          </form>
          <Submit label='SIGNUP'/>
          <p className="text">Already have an account?<Link to='/Login' className="text redirect signup"> Log in here.</Link></p>
        </div>
    );
}

export default SignupForm;