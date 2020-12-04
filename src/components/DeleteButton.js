import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Icon, Confirm } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../utils/graphql";
import MyPopup from "./MyPopup";

const DeleteButton = ({ postId, commentId, routeTo }) => {
  const [open, toggle] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deleteItem] = useMutation(mutation, {
    update(proxy) {
      toggle(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((post) => post.id !== postId),
          },
        });
        routeTo && routeTo();
      }
    },
    variables: { postId, commentId },
  });
  return (
    <>
      <MyPopup content={commentId ? "Delete this comment" : "Delete this post"}>
        <Button
          floated="right"
          as="div"
          color="red"
          onClick={() => toggle(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={open}
        onCancel={() => toggle(false)}
        onConfirm={deleteItem}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
