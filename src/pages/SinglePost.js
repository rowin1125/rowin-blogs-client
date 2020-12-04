import React, { useContext, useRef, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Divider,
  Form,
  Grid,
  Icon,
  Image,
  Label,
} from "semantic-ui-react";
import moment from "moment";

import LikeButton from "../components/LikeButton";
import MyPopup from "../components/MyPopup";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";

const SinglePost = (props) => {
  const postId = props.match.params.postId;

  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);

  const { user } = useContext(AuthContext);
  const { data } = useQuery(FETCH_POST_QUERY, { variables: { postId } });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: { postId, body: comment },
  });

  const redirectAfterDelete = () => props.history.push("/");

  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading post.......</p>;
  } else {
    const {
      id,
      title,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = data.getPost;
    console.log("id", id);

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="small"
              src={`https://picsum.photos/800/800?random=${likeCount}`}
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{title}</Card.Header>
                <Card.Meta style={{ marginTop: "10px" }}>
                  Created {moment(createdAt).fromNow()} by{" "}
                  <Label style={{ marginLeft: "4px" }}>{username}</Label>
                </Card.Meta>
                <hr />

                <Card.Description style={{ margin: "16px 0" }}>
                  {body}
                </Card.Description>
                <hr />
                <Card.Content extra>
                  <LikeButton user={user} post={{ id, likeCount, likes }} />
                  <MyPopup content="Comments on Post">
                    <Button
                      as="div"
                      labelPosition="right"
                      onClick={() => console.log("comment on post")}
                    >
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  </MyPopup>
                  {user && user.username === username && (
                    <DeleteButton postId={id} routeTo={redirectAfterDelete} />
                  )}
                </Card.Content>
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <MyPopup content="Post a comment">
                        <button
                          className="ui button teal"
                          type="submit"
                          disabled={comment.trim() === ""}
                          onClick={submitComment}
                        >
                          Post a comment
                        </button>
                      </MyPopup>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      title
      body
      createdAt
      username
      likeCount
      likes {
        id
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
