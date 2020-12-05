const { gql } = require("@apollo/client");

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      title
      description
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
