import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { AUTH_CONFIG } from './auth/auth-config';
import TeamList from './pages/TeamList';
import GameList from './pages/GameList';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import { ApolloProvider } from "@apollo/react-hooks";
import LinkButton from './components/LinkButton';

const useStyles = makeStyles({
  root: {
    height: '100%',
    backgroundColor: '#deebff',
  },
  navBarTitle: {
    paddingRight: '100px',
  },
  linksRow: {
    paddingRight: '50px',
  },
  links: {
    textDecoration: 'none',
    color: "white",
  },
  navBar: {
    backgroundColor: '#1a468a',
  }
});

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
              <div className={classes.navBarTitle}>
                <Typography variant="h6">
                  NFL Game Predictor
                </Typography>
              </div>
              <div className={classes.linksRow}>
                <Link to={"/"} className={classes.links}>
                Team List
                </Link>
              </div>
              <div className={classes.linksRow}>
                <Link to={"/admin-game-list"} className={classes.links}>
                  Schedule
                </Link>
              </div>
              <div className={classes.linksRow}>
                <LinkButton 
                  onClick={logout}
                  label="Logout"
                />
              </div>
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
