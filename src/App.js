import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { SemanticToastContainer } from "react-semantic-toasts";

import "react-semantic-toasts/styles/react-semantic-alert.css";
import "semantic-ui-css/semantic.min.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";

import MenuBar from "./components/MenuBar";
import AuthRoute from "./utils/AuthRoute";
import { AuthProvider } from "./context/auth";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <SemanticToastContainer
            className="custom-toaster"
            position="bottom-right"
          />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
