import React, { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";

import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";
import { toast } from "react-semantic-toasts";

const Login = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(loginUser, {
    username: "",
    password: "",
  });

  const [login, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
      toast({
        title: "Successfully logged in!",
        type: "success",
        icon: "unlock",
        description: <p>You are now logged in, let's goo! 🚀</p>,
      });
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
      toast({
        title: "Oeeps something went wrong!",
        type: "error",
        icon: "lock",
        description: <p>Please try again! ⛔️</p>,
      });
    },
    variables: values,
  });

  function loginUser() {
    login();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Your username here"
          name="username"
          type="text"
          error={errors.username ? true : false}
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Your password here"
          name="password"
          type="password"
          error={errors.password ? true : false}
          value={values.password}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
