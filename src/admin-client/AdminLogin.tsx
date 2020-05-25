import React from 'react';
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { setContext } from "apollo-link-context";

function AdminLogin() {
    const httpLink = new HttpLink({
        uri: "your-graphql-endpoint"
    });
    
    const client = new ApolloClient(
        {
            link: httpLink,
            cache: new InMemoryCache()
        }
    );
    
    return (
        <ApolloProvider client={client}>
            hi
        </ApolloProvider>
    );
}

export default AdminLogin;
