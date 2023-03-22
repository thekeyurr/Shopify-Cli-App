import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from "react-apollo";


const client = new ApolloClient({
  fetchOptions: {
    creadentials: 'include'
  }
})

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
            <ApolloProvider client={client}>
              <Routes pages={pages} />
            </ApolloProvider>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
