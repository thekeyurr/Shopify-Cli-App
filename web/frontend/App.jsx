import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from "@apollo/client";
import React from 'react';

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";

// const client = new ApolloClient({
//   fetchOptions: {
//     credentials: 'include'
//   },
//   cache: new InMemoryCache(),
// });

// console.log("client data==========",client);

const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include'
  },
  cache: new InMemoryCache(),
});
  const shop = "onepulsedemo.myshopify.com";




export default function App() {


  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const config = { apiKey: API_KEY, shopOrigin: shop, forceRedirect: true};

  console.log("config============>",config);

  return (
  <Provider config={config}>
  <AppProvider  i18n={translations}>  
  <ApolloProvider client={client}>
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "Page Name",
                  destination: "/pagename",
                },
              ]}
            />
              <Routes pages={pages} />
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  </ApolloProvider>
  </AppProvider>
  </Provider>
  );
}
