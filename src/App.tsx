import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AdminGameList from './admin-client/AdminGameList';
import TeamList from './client/TeamList';
import TeamDetails from './client/TeamDetails';
import GameList from './client/GameList';
import ApolloClient from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

interface Definition {
  kind: string;
  operation?: string;
};

function App() {
  const httpLink = new HttpLink({
    uri: "https://nfl-game-prediction.herokuapp.com/v1/graphql"
  });

  const wsLink = new WebSocketLink({
    uri: "ws://nfl-game-prediction.herokuapp.com/v1/graphql",
    options: {
      reconnect: true,
    }
  });

  const link = split(
    ({ query }) => {
      const { kind, operation }: Definition = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Switch>
            <Route exact path='/' component={TeamList} />
            <Route path='/details' component={TeamDetails} />
            <Route path='/game-list' component={GameList} />
            <Route path='/admin-game-list' component={AdminGameList} />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
