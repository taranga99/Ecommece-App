import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";

const Signin = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    user: { userInfo },
  } = state;

  const submitHandler = async (e) => {
    // prevents refreshing of the page when the user
    // clicks on the signin button
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account??{" "}
          <Link to={`/signin?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
};

export default Signin;
