import React, { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link, useParams } from "react-router-dom";

import breweriesService from "../services/BreweriesDataService";

import type { Brewery as BreweryType, Comment, User } from "../types";

interface BreweryProps {
  user: User | null;
}

const Brewery: React.FC<BreweryProps> = ({ user }) => {
  const [brewery, setBrewery] = useState<BreweryType>({
    id: "",
    name: "",
    brewery_type: "",
    city: "",
    state: "",
  });
  const [comments, setComments] = useState<Comment[]>([]);

  const { id } = useParams<{ id: string }>();

  const getBrewery = (breweryId: string) => {
    breweriesService
      .get(breweryId)
      .then((response) => {
        setBrewery(response.data);
      })
      .catch((error) => {
        throw error;
      });
  };

  const getComments = (breweryId: string) => {
    breweriesService
      .getCommentsByBreweryId(breweryId)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        throw error;
      });
  };

  useEffect(() => {
    if (id) {
      getBrewery(id);
      getComments(id);
    }
  }, [id]);

  const deleteComment = (commentId: string) => {
    if (!user) return;
    breweriesService
      .deleteComment(commentId, user.id)
      .then(() => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId),
        );
      })
      .catch((error) => {
        throw error;
      });
  };

  return (
    <div>
      <Container>
        <Row className="mb-4">
          <Col md={4}>
            {brewery.ImageLink ? (
              <Card.Img
                alt={brewery.name}
                src={brewery.ImageLink}
                style={{ maxHeight: "300px", objectFit: "cover" }}
                variant="top"
              />
            ) : null}
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
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {brewery.website_url}
                  </a>
                </Card.Text>
                <Card.Text>
                  <strong>Phone:</strong> {brewery.phone}
                </Card.Text>
                {user ? (
                  <div className="mt-3">
                    <Link to={`/breweries/${id}/comment`}>Leave a Comment</Link>
                  </div>
                ) : null}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h2 className="mt-4 mb-3">Comments</h2>
        <Row>
          {comments && comments.length > 0
            ? comments.map((comment, index) => (
                <Col
                  key={comment.id || `comment-${index}`}
                  className="mb-3"
                  xs={12}
                >
                  <Card>
                    <Card.Body>
                      <h5>
                        {`${comment.name} commented on ${new Date(
                          Date.parse(comment.lastModified),
                        ).toDateString()}`}
                      </h5>
                      <p>{comment.text}</p>
                      {user && user.id === comment.user_id ? (
                        <React.Fragment>
                          <Link
                            className="btn btn-primary me-2"
                            state={{ currentComment: comment }}
                            to={`/breweries/${id}/comment`}
                          >
                            Edit
                          </Link>
                          <Button
                            onClick={() => deleteComment(comment.id)}
                            variant="danger"
                          >
                            Delete
                          </Button>
                        </React.Fragment>
                      ) : null}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            : null}
        </Row>
      </Container>
    </div>
  );
};

export default Brewery;
