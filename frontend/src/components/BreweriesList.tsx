import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Col, Row, Container, Card } from "react-bootstrap";
import BreweriesDataService from "../services/BreweriesDataService";
import type { AxiosResponse } from "axios";

interface Brewery {
  _id: string;
  name: string;
  brewery_type: string;
  city: string;
  state: string;
  ImageLink?: string;
}

interface BreweriesResponse {
  breweries: Brewery[];
}

const BreweriesList: React.FC = () => {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [searchMode, setSearchMode] = useState("name");
  const [searchValue, setSearchValue] = useState("");

  const searchOptions = ["name", "type", "city", "state"];

  const retrieveBreweries = useCallback(() => {
    BreweriesDataService.getAll()
      .then((response: AxiosResponse<BreweriesResponse>) => {
        setBreweries(response.data.breweries);
      })
      .catch((e: Error) => console.log(e));
  }, []);

  const find = useCallback(
    (query: string, by: string) => {
      if (!query) return retrieveBreweries();
      const searchKey = by === "type" ? "brewery_type" : by;
      BreweriesDataService.find(query, searchKey)
        .then((response: AxiosResponse<BreweriesResponse>) => {
          setBreweries(response.data.breweries);
        })
        .catch((e: Error) => console.log(e));
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
        <Form className="mb-4">
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Search Field</Form.Label>
                <Form.Control
                  as="select"
                  value={searchMode}
                  onChange={(e) =>
                    setSearchMode(
                      (e.target as unknown as unknown as HTMLSelectElement)
                        .value,
                    )
                  }
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
              <Form.Group>
                <Form.Label>Search Term</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`Search by ${searchMode}`}
                  value={searchValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchValue(e.target.value)
                  }
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button
                variant="primary"
                onClick={handleSearch}
                className="w-100"
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          {breweries.map((brewery) => (
            <Col key={brewery._id} md={4} className="mb-4">
              <Card>
                {brewery.ImageLink && (
                  <Card.Img
                    variant="top"
                    src={brewery.ImageLink}
                    alt={brewery.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{brewery.name}</Card.Title>
                  <Card.Text>Type: {brewery.brewery_type}</Card.Text>
                  <Card.Text>City: {brewery.city}</Card.Text>
                  <Card.Text>State: {brewery.state}</Card.Text>
                  <Link to={`/breweries/${brewery._id}`}>
                    View Details
                  </Link>
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
