import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Container, Col, Row, Button } from "react-bootstrap";
import BreweriesDataService from "../services/BreweriesDataService";
import type { AxiosResponse } from "axios";

interface User {
  name: string;
  id: string;
}

interface BreweryDetails {
  _id: string | null;
  name: string;
  brewery_type: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  website_url: string;
  phone: string;
  ImageLink?: string;
}

interface Comment {
  _id: string;
  name: string;
  text: string;
  userId: string;
  lastModified: string;
}

interface BreweryProps {
  user: User | null;
}

const Brewery: React.FC<BreweryProps> = (props) => {
  const [brewery, setBrewery] = useState<BreweryDetails>({
    _id: null,
    name: "",
    brewery_type: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    website_url: "",
    phone: "",
  });
  const [comments, setComments] = useState<Comment[]>([]);

  const { id } = useParams<{ id: string }>();

  const getBrewery = (id: string) => {
    BreweriesDataService.get(id)
      .then((response: AxiosResponse<BreweryDetails>) => {
        setBrewery(response.data);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const getComments = (id: string) => {
    BreweriesDataService.getCommentsByBreweryId(id)
      .then((response: AxiosResponse<Comment[]>) => {
        setComments(response.data);
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (id) {
      getBrewery(id);
      getComments(id);
    }
  }, [id]);

  const deleteComment = (commentId: string, index: number) => {
    if (props.user) {
      BreweriesDataService.deleteComment(commentId, props.user.id)
        .then(() => {
          setComments((prevComments) => {
            const updatedComments = [...prevComments];
            updatedComments.splice(index, 1);
            return updatedComments;
          });
        })
        .catch((e: Error) => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      <Container>
        <Row className="mb-4">
          <Col md={4}>
            {brewery.ImageLink && (
              <Card.Img
                variant="top"
                src={brewery.ImageLink}
                alt={brewery.name}
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            )}
          </Col>
          <Col md={8}>
            <Card>
              <Card.Header as="h5">{brewery.name}</Card.Header>
              <Card.Body>
                <Card.Text>
                  <strong>Type:</strong> {brewery.brewery_type}
                </Card.Text>
                <Card.Text>
                  <strong>City:</strong> {brewery.city}
                </Card.Text>
                <Card.Text>
                  <strong>State:</strong> {brewery.state}
                </Card.Text>
                <Card.Text>
                  <strong>Postal Code:</strong> {brewery.postal_code}
                </Card.Text>
                <Card.Text>
                  <strong>Country:</strong> {brewery.country}
                </Card.Text>
                <Card.Text>
                  <strong>Website:</strong>{" "}
                  <a
                    href={brewery.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {brewery.website_url}
                  </a>
                </Card.Text>
                <Card.Text>
                  <strong>Phone:</strong> {brewery.phone}
                </Card.Text>
                {props.user && (
                  <div className="mt-3">
                    <Link to={`/breweries/${id}/comment`}>
                      Leave a Comment
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h2 className="mt-4 mb-3">Comments</h2>
        <Row>
          {comments &&
            comments.length > 0 &&
            comments.map((comment, index) => (
              <Col xs={12} className="mb-3" key={index}>
                <Card>
                  <Card.Body>
                    <h5>
                      {comment.name +
                        " commented on " +
                        new Date(
                          Date.parse(comment.lastModified),
                        ).toDateString()}
                    </h5>
                    <p>{comment.text}</p>
                    {props.user && props.user.id === comment.userId && (
                      <div>
                        <Link
                          to={`/breweries/${id}/comment`}
                          state={{ currentComment: comment }}
                          className="btn btn-primary me-2"
                        >
                          Edit
                        </Link>
                        <Button
                          variant="danger"
                          onClick={() => deleteComment(comment._id, index)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </div>
  );
};

export default Brewery;
