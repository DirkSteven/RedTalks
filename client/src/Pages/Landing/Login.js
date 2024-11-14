import React from "react";

export default function(){
    return (
        <div className="panel">
            <div className="container">
                <h1>Login</h1>
                <div className="UserInput">
                    <input type="text" placeholder="Email Address"></input>
                    <input type="password" placeholder="Password"></input>
                </div>
                <button className="submit">Login</button>
            </div>
        </div>
    )
}