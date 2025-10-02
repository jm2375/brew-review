import React, { useCallback, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, Route, Routes } from "react-router-dom";

import "./App.css";
import AddComment from "./components/AddComment";
import BreweriesList from "./components/BreweriesList";
import Brewery from "./components/Brewery";
import Login from "./components/Login";

import type { User } from "./types";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <div className="App">
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand>Brew Review</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/breweries">
                Breweries
              </Nav.Link>
              {user ? (
                <Nav.Link onClick={logout}>Logout ({user.name})</Nav.Link>
              ) : (
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route element={<BreweriesList />} path="/" />
          <Route element={<BreweriesList />} path="/breweries" />
          <Route element={<Brewery user={user} />} path="/breweries/:id" />
          <Route
            element={<AddComment user={user} />}
            path="/breweries/:id/comment"
          />
          <Route element={<Login login={login} />} path="/login" />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
