import React, { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

import type { User } from "../types";

interface LoginProps {
  login: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ login }) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      login(user);
      const timer = setTimeout(() => {
        navigate("/breweries");
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [login, user, navigate]);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleSubmit = () => {
    setUser({ name, id });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        {user ? (
          <div className="alert alert-success">
            <h5>{user.name} logged in successfully.</h5>
          </div>
        ) : (
          <div className="border rounded py-5 px-4">
            <Form>
              <Form.Group className="mb-4">
                <Form.Label className="fs-5">Username</Form.Label>
                <Form.Control
                  onChange={onChangeName}
                  placeholder="Enter username"
                  size="lg"
                  type="text"
                  value={name}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="fs-5">ID</Form.Label>
                <Form.Control
                  onChange={onChangeId}
                  placeholder="Enter ID"
                  size="lg"
                  type="text"
                  value={id}
                />
              </Form.Group>
              <Button
                className="w-100 py-2"
                disabled={!name || !id}
                onClick={handleSubmit}
                variant="primary"
              >
                Submit
              </Button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
