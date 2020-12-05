import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import MyPopup from "./MyPopup";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

const PostCard = ({
  index,
  post: {
    title,
    description,
    createdAt,
    id,
    username,
    likeCount,
    commentCount,
    likes,
  },
}) => {
  const { user } = useContext(AuthContext);
  return (
    <Card fluid>
      <Card.Content as={Link} to={`/posts/${id}`}>
        <Image
          floated="right"
          circular
          size="tiny"
          src={`https://picsum.photos/800/800?random=${index}`}
        />
        <Card.Header>{title}</Card.Header>
        <Card.Meta>
          Created {moment(createdAt).fromNow()} by{" "}
          <Label style={{ marginLeft: "4px" }}>{username}</Label>
        </Card.Meta>
        <Card.Description>
          <Icon name="quote left" size="small" /> {description}{" "}
          <Icon name="quote right" size="small" />
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <MyPopup content="Comment on post">
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button color="blue" basic>
              <Icon name="comments" />
              Like
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
