import PropTypes from "prop-types";
import { useState } from "react";

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    login({ username, password });
    setUsername("");
    setPassword("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>log in to application</h1>
      <div>
        username{" "}
        <input
          type="text"
          value={username}
          name="Username"
          data-cy="login-username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{" "}
        <input
          type="password"
          value={password}
          name="Password"
          data-cy="login-password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" data-cy="login-submit">
        login
      </button>
    </form>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginForm;
