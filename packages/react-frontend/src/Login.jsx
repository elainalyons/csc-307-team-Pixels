import React, { useState } from "react";

function Login(props) {
  const [creds, setCreds] = useState({
    username: "",
    password: ""
  });

  return (
    <form>
      <label htmlFor="username">UserName</label>
      <input
        data-cy="login-username"
        type="text"
        name="username"
        id="username"
        value={creds.username}
        onChange={handleChange}
      />
      <label htmlFor="password">Password</label>
      <input
        data-cy="login-password"
        type="password"
        name="password"
        id="password"
        value={creds.password}
        onChange={handleChange}
      />
      <input
        data-cy="login-submit"
        type="button"
        value={props.buttonLabel || "Log In"}
        onClick={submitForm}
      />
      {props.message && <p>{props.message}</p>} 
      {/* return error message*/}

    </form>
  );

  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setCreds({ ...creds, username: value });
        break;
      case "password":
        setCreds({ ...creds, password: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ username: "", password: "" });
  }
}
export default Login;