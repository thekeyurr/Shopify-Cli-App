import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from "@apollo/client";


const client = new ApolloClient({
  fetchOptions: {
    credentials: 'include'
  },
  cache: new InMemoryCache(),
});


console.log("client============",client)

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";




export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    
  <ApolloProvider client={client}>
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            {/* <NavigationMenu
              navigationLinks={[
                {
                  label: "Page Name",
                  destination: "/pagename",
                },
              ]}
            /> */}
              <Routes pages={pages} />
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  </ApolloProvider>
  );
}
