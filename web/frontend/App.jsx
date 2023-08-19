import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import { DiscountProvider } from "./components/providers/DiscountProvider";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");



  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
        <DiscountProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "Page name",
                  destination: "/pagename",
                },
                 {
                  label: "Create discount",
                  destination: "/discount",
                },
                {
                  label: "Test name",
                  destination: "/test",
                }
              ]}
            />
            <Routes pages={pages} />
          </QueryProvider>

          </DiscountProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
