import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Grid, Modal, Transition } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

const Home = () => {
  const [open, toggle] = useState(false);
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  return (
    <>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid centered column={3}>
            <Grid style={{ marginTop: "32px" }}>
              <Button onClick={() => toggle(!open)} size="large" positive>
                Add a new Post
              </Button>
            </Grid>
          </Grid>
        )}
        <Modal dimmer="blurring" open={open} onClose={() => toggle(false)}>
          <Modal.Header>
            <p className="page-title">
              Create your new post and contribute to Blogify
            </p>
          </Modal.Header>
          <Modal.Content>
            <PostForm toggle={toggle} />
          </Modal.Content>
        </Modal>
        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
          <Transition.Group>
            <Grid style={{ marginTop: "32px" }}>
              {data ? (
                data.getPosts.map((post, i) => (
                  <Grid.Column
                    mobile={16}
                    tablet={8}
                    computer={8}
                    key={post.id}
                    style={{ marginBottom: 20 }}
                  >
                    <PostCard post={post} index={i} />
                  </Grid.Column>
                ))
              ) : (
                <>
                  <h2>📡 No data found!</h2>
                  <h3>
                    The BE is problably sleeping beause of hosting on heroku 😴
                  </h3>
                  <h3>
                    Visit this{" "}
                    <a href="https://rowin-blogify.herokuapp.com/">link </a> to
                    activate it 🥳
                  </h3>
                </>
              )}
            </Grid>
          </Transition.Group>
        )}
      </Grid.Row>
    </>
  );
};

export default Home;
