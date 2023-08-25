import { useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
} from "@shopify/polaris";
import { Toast, useNavigate } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(false);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate()

  
  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: "5 products created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };
   //--------------------------------------------------------

    const fetchCollection = async ()=>{
      try {
        const response =await fetch('/api/collections/433787502876');
        console.log("Collection=============",await response.json());
      } catch (error) {
        console.log(error);
      }
    }

    fetchCollection();

    // -----------------------------------------------------

    const fetchOrder = async ()=>{
      try {
        const response = await fetch('/api/orders');
        console.log("Order=============",await response.json());
      } catch (error) {
        console.log(error);
      }
    }

    fetchOrder();

    // -------------------------------------------------------

    const fetchCustomer = async()=>{
      try {
        const response = await fetch('/api/customers');
        console.log("customers==============",await response.json());
      } catch (error) {
        console.log(error);
      }
    }

    fetchCustomer();

    // --------------------------------------------------

    const fetchCart = async ()=>{
      try {
        const response = await fetch('/api/checkouts/5a7d68affe475df29ac00a8429d3a022');
        console.log("Collection=============",await response.json());
      } catch (error) {
        console.log(error);
      }
    }

    fetchCart();


    

  return (
    <>
      {toastMarkup}
      <Card
        title="Product Counter"
        sectioned
        primaryFooterAction={{
          content: "Populate 5 products",
          onAction: handlePopulate,
          loading: isLoading,
        }}
        secondaryFooterActions={[{content: 'View all products', onAction: () => navigate({name: 'Product'}, {target: 'new'})}]}
      >
        <TextContainer spacing="loose">
         
        </TextContainer>
      </Card>
    </>
  );
}
