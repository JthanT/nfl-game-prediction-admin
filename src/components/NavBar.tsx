import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { AUTH_CONFIG } from '../auth/auth-config';
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import LinkButton from '../components/LinkButton';

const useStyles = makeStyles({
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
    backgroundColor: '#292929',
  }
});

function NavBar() {

  const { logout, loginWithRedirect, getAccessTokenSilently, getIdTokenClaims } = useAuth0();

  const classes = useStyles();

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
  );
}

export default NavBar;
