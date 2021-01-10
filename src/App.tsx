import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AUTH_CONFIG } from './auth/auth-config';
import TeamList from './pages/TeamList';
import GameList from './pages/GameList';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from '@apollo/client';
import { useAuth0 } from "@auth0/auth0-react";
import { ApolloProvider } from "@apollo/react-hooks";
import NavBar from './components/NavBar';

const useStyles = makeStyles({
  root: {
    height: '100%',
    backgroundColor: '#deebff',
  },
});

function App() {

  const { loginWithRedirect, getAccessTokenSilently, getIdTokenClaims } = useAuth0();
  
  const token = localStorage.getItem('id_token');

  const classes = useStyles();

  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_API_URL,
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
          <NavBar />
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
