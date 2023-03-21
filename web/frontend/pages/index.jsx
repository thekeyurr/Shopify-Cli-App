import { EmptyState, Layout, Modal, Page, TextContainer } from "@shopify/polaris";
import React,{ useCallback, useState } from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";

function Index(){

  // dynemic img 
  const img = "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"

  // resource picker component data
  const [modal, setmodal]= useState({open: false});

  return(
    <Page>
       <ResourcePicker 
           resourceType="Product"
           open={modal.open}
           showVariants={true}
           showHidden={true}
           onCancel={() => setmodal({open: false})}
        />
      <Layout>
        <EmptyState 
        heading="Sample App"
        action={{
          content: 'Select Products',
          onAction : () => setmodal({open: true}, console.log(modal))
        }}
        image={img}
        >
          <p>Select Product</p>
        </EmptyState>
      </Layout>
    </Page>
  )
} 

export default Index;