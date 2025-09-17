import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import BreweriesDataService from "../services/BreweriesDataService";
import type { AxiosResponse } from "axios";

interface User {
  name: string;
  id: string;
}

interface AddCommentProps {
  user: User | null;
}

interface CommentData {
  text: string;
  name: string;
  userId: string;
  brewery_id: string | undefined;
  comment_id?: string;
}

const AddComment: React.FC<AddCommentProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const editing = location.state && location.state.currentComment;
  const initialCommentState = editing ? location.state.currentComment.text : "";

  const [comment, setComment] = useState(initialCommentState);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate(`/breweries/${id}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [submitted, id, navigate]);

  const onChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const saveComment = () => {
    if (!props.user) {
      return;
    }

    const data: CommentData = {
      text: comment,
      name: props.user.name,
      userId: props.user.id,
      brewery_id: id,
    };

    if (editing) {
      data.comment_id = location.state.currentComment._id;
      BreweriesDataService.updateComment(data)
        .then((response: AxiosResponse) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e: Error) => {
          console.log(e);
        });
    } else {
      BreweriesDataService.createComment(data)
        .then(() => {
          setSubmitted(true);
        })
        .catch(() => {});
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
              as="textarea"
              rows={5}
              required
              value={comment}
              onChange={onChangeComment}
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Button className="w-100" onClick={saveComment}>
                Submit
              </Button>
            </Col>
            <Col md={6}>
              <Link
                to={"/breweries/" + id}
                className="btn btn-secondary w-100"
              >
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
