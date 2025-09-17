import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  id: string;
}

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
    <div>
      {user ? (
        <div className="alert alert-success text-center">
          <h5>
            {user.name} ({user.id}) logged in successfully.
          </h5>
        </div>
      ) : (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              value={name}
              onChange={onChangeName}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter ID"
              value={id}
              onChange={onChangeId}
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!name || !id}
            className="w-100"
          >
            Submit
          </Button>
        </Form>
      )}
    </div>
  );
};

export default Login;
