import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { useAuth0 } from "./auth/react-auth0-spa";
import TeamList from './admin-client/TeamList';
import GameList from './admin-client/GameList';
import ApolloClient from "apollo-client";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { ApolloProvider } from "@apollo/react-hooks";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

function App({idToken}) {

  const httpLink = new HttpLink({
    uri: "https://nfl-game-prediction.herokuapp.com/v1/graphql",
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  const { logout } = useAuth0();

  const classes = useStyles();

  return (
    <ApolloProvider client={client}>
      <div className={classes.root}>
        <Router>
          <AppBar position="static" className={classes.navBar}>
            <Toolbar>
              <Typography variant="h6" className={classes.navBarTitle}>
                NFL Game Predictor
              </Typography>
              <Link to={"/"} className={classes.navBarSectionTitles}>
                Team List
              </Link>
              <Link to={"/admin-game-list"} className={classes.navBarSectionTitles}>
                Schedule
              </Link>
              <Button onClick={() => logout()}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>

          <Switch>
            <Route exact path='/' component={TeamList} />
            <Route path='/admin-game-list' component={GameList} />
            <Route render={() => <Redirect to={{pathname: "/"}} />} />
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: '#dae4f2',
  },
  navBarTitle: {
    flexGrow: 1,
  },
  navBarSectionTitles: {
    flexGrow: 1,
    textDecoration: 'none',
    color: "white",
  },
  navBar: {
    backgroundColor: '#1a468a',
  }
});
