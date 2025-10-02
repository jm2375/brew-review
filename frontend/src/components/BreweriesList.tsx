import React, { useCallback, useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

import breweriesService from "../services/BreweriesDataService";

import type { Brewery } from "../types";

const BreweriesList: React.FC = () => {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [searchMode, setSearchMode] = useState("name");
  const [searchValue, setSearchValue] = useState("");

  const searchOptions = ["name", "type", "city", "state"];

  const retrieveBreweries = useCallback(() => {
    breweriesService
      .getAll()
      .then((response) => {
        setBreweries(response.data.breweries);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  const find = useCallback(
    (query: string, by: string) => {
      if (!query || query.trim() === "") {
        retrieveBreweries();
        return;
      }
      const searchKey = by === "type" ? "brewery_type" : by;
      breweriesService
        .find(query.trim(), searchKey)
        .then((response) => {
          setBreweries(response.data.breweries);
        })
        .catch((error) => {
          throw error;
        });
    },
    [retrieveBreweries],
  );

  const handleSearch = () => {
    find(searchValue, searchMode);
  };

  useEffect(() => {
    retrieveBreweries();
  }, [retrieveBreweries]);

  return (
    <div className="App">
      <Container>
        <Form
          className="mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Row className="align-items-end">
            <Col md={3}>
              <Form.Group className="mb-0">
                <Form.Label>Search Field</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setSearchMode(e.target.value)}
                  value={searchMode}
                >
                  {searchOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-0">
                <Form.Label>Search Term</Form.Label>
                <Form.Control
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={`Search by ${searchMode}`}
                  type="text"
                  value={searchValue}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Button
                className="w-100"
                onClick={handleSearch}
                type="submit"
                variant="primary"
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          {breweries.map((brewery) => (
            <Col key={brewery.id} className="mb-4" md={4}>
              <Card>
                {brewery.ImageLink ? (
                  <Card.Img
                    alt={brewery.name}
                    src={brewery.ImageLink}
                    style={{ height: "200px", objectFit: "cover" }}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{brewery.name}</Card.Title>
                  <Card.Text>Type: {brewery.brewery_type}</Card.Text>
                  <Card.Text>City: {brewery.city}</Card.Text>
                  <Card.Text>State: {brewery.state}</Card.Text>
                  <Link to={`/breweries/${brewery.id}`}>View Details</Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default BreweriesList;
