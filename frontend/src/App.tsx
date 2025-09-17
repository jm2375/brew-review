import React, { useState, useCallback } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import BreweriesList from "./components/BreweriesList";
import Brewery from "./components/Brewery";
import Login from "./components/login";
import AddComment from "./components/addComments";

interface User {
  name: string;
  id: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((user: User) => {
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Brewery Comments</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/breweries">
                Breweries
              </Nav.Link>
              {user ? (
                <>
                  <Nav.Link onClick={logout}>Logout ({user.name})</Nav.Link>
                </>
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
          <Route path="/" element={<BreweriesList />} />
          <Route path="/breweries" element={<BreweriesList />} />
          <Route path="/breweries/:id" element={<Brewery user={user} />} />
          <Route
            path="/breweries/:id/comment"
            element={<AddComment user={user} />}
          />
          <Route path="/login" element={<Login login={login} />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
