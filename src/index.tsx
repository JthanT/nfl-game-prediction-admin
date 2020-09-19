import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Auth0Provider } from "@auth0/auth0-react";
import { AUTH_CONFIG } from './auth/auth-config';
import * as serviceWorker from './serviceWorker';
import App from './App';

// const onRedirectCallback = appState => {
//   window.history.replaceState(
//     {},
//     document.title,
//     appState && appState.targetUrl
//       ? appState.targetUrl
//       : window.location.pathname
//   );
// };

ReactDOM.render(
  <Auth0Provider
    domain={AUTH_CONFIG.domain}
    clientId={AUTH_CONFIG.clientId}
    redirectUri={AUTH_CONFIG.callbackUrl}
    // onRedirectCallback={onRedirectCallback}
    audience={AUTH_CONFIG.audience}
    useRefreshTokens={true}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
