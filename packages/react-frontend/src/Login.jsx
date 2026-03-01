import React, { useState } from "react";

function Login(props) {
  const [creds, setCreds] = useState({
    username: "",
    pwd: ""
  });

  return (
    <form>
      <label htmlFor="username">UserName</label>
      <input
        type="text"
        name="username"
        id="username"
        value={creds.username}
        onChange={handleChange}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={creds.pwd}
        onChange={handleChange}
      />
      <input
        type="button"
        value={props.buttonLabel || "Log In"}
        onClick={submitForm}
      />
    </form>
  );

  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setCreds({ ...creds, username: value });
        break;
      case "password":
        setCreds({ ...creds, pwd: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ username: "", pwd: "" });
  }
}
export default Login;