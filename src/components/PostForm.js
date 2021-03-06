import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "../utils/hooks";
import { FETCH_POSTS_QUERY } from "../utils/graphql";
import { toast } from "react-semantic-toasts";

function PostForm({ toggle }) {
  const [errors, setErrors] = useState({});
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    title: "",
    description: "",
    body: "",
  });

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.title = "";
      values.description = "";
      values.body = "";
      toggle(false);
      toast({
        title: "Succesfully created!",
        type: "success",
        icon: "signup",
      });
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <h2>Create a post:</h2>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
      <Form onSubmit={onSubmit} style={{ marginBottom: "2rem" }}>
        <Form.Field>
          <Form.Input
            placeholder="Title of post"
            name="title"
            onChange={onChange}
            value={values.title}
            error={errors.title ? true : false}
          />
          <Form.Input
            placeholder="Short description"
            name="description"
            onChange={onChange}
            value={values.description}
            error={errors.description ? true : false}
          />
          <Form.TextArea
            placeholder="Content of the post"
            name="body"
            rows="10"
            onChange={onChange}
            value={values.body}
            error={errors.body ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($title: String!, $description: String!, $body: String!) {
    createPost(title: $title, description: $description, body: $body) {
      id
      title
      description
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
