import React, { useContext } from "react";
import { useQuery, gql } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
// import PostCard from "../components/PostCard";
// import { AuthContext } from "../context/auth";
// import PostForm from "../components/PostForm";
// import { FETCH_POSTS_QUERY } from "../utils/graphql";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const Home = () => {
  // const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Blogs</h1>
      </Grid.Row>
      <Grid.Row>
        <Transition.Group>
          {loading ? (
            <p>loading...</p>
          ) : (
            <>
              {data.getPosts &&
                data.getPosts.map((post) => (
                  <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </>
          )}
        </Transition.Group>
      </Grid.Row>
    </Grid>
  );
};

export default Home;
