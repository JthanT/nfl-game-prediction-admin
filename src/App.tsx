import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { AUTH_CONFIG } from './auth/auth-config';
import TeamList from './admin-client/TeamList';
import GameList from './admin-client/GameList';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from '@apollo/client'
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Typography, Button, Toolbar } from '@material-ui/core';
import { ApolloProvider } from "@apollo/react-hooks";

function App() {

  const { logout, loginWithRedirect, getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  
  const token = localStorage.getItem('id_token');

  const classes = useStyles();

  const httpLink = new HttpLink({
    uri: "https://nfl-game-prediction.herokuapp.com/v1/graphql",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        await getAccessTokenSilently({
          audience: AUTH_CONFIG.audience,
        });
        const idToken = await getIdTokenClaims();
        localStorage.setItem('id_token', idToken.__raw);
      } catch (e) {
        localStorage.removeItem('id_token');
        loginWithRedirect();
      }
    };
  
    getUserMetadata();
  });

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
