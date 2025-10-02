import React, { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import breweriesService from "../services/BreweriesDataService";

import type { Comment, User } from "../types";

interface AddCommentProps {
  user: User | null;
}

interface LocationState {
  currentComment?: Comment;
}

const AddComment: React.FC<AddCommentProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const state = location.state as LocationState | undefined;
  const editing = !!state?.currentComment;
  const initialCommentState = state?.currentComment?.text ?? "";

  const [comment, setComment] = useState(initialCommentState);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && id) {
      const timer = setTimeout(() => {
        navigate(`/breweries/${id}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [submitted, id, navigate]);

  const onChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const saveComment = () => {
    if (!user || !id) return;

    if (editing && state?.currentComment) {
      const data = {
        text: comment,
        user_id: user.id,
        comment_id: state.currentComment.id,
      };
      breweriesService
        .updateComment(data)
        .then(() => {
          setSubmitted(true);
        })
        .catch((error) => {
          throw error;
        });
    } else {
      const data = {
        text: comment,
        name: user.name,
        user_id: user.id,
        brewery_id: id,
      };
      breweriesService
        .createComment(data)
        .then(() => {
          setSubmitted(true);
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  return (
    <div>
      {submitted ? (
        <div className="alert alert-success text-center">
          <h5>Comment submitted successfully</h5>
        </div>
      ) : (
        <Form>
          <Form.Group className="mb-3">
            <h2 className="mb-3">Comment</h2>
            <Form.Control
              required
              as="textarea"
              onChange={onChangeComment}
              rows={5}
              value={comment}
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Button className="w-100" onClick={saveComment}>
                Submit
              </Button>
            </Col>
            <Col md={6}>
              <Link className="btn btn-secondary w-100" to={`/breweries/${id}`}>
                Cancel
              </Link>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default AddComment;
