import { EmptyState, Layout, Modal, Page, TextContainer } from "@shopify/polaris";
import React,{ useCallback, useState } from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";
import store from 'store-js';
import ProductList from "../components/ResourceList";

function Index(){
  // dynemic img 
  const img = "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"

  // resource picker component data
  const [modal, setmodal]= useState({open: false});
  const emptyState = !store.get('ids');


  function handleSelection(resources){
    const idsFromResources = resources.selection.map((product)=> product.id);
    setmodal({open: false});
    store.set('ids', idsFromResources)
    console.log('this is product ids==========', store.get('ids'));
  }

  return(
    <Page>
       <ResourcePicker 
           resourceType="Product"
           open={modal.open}
           showVariants={false}
           selectMultiple={true}
           onCancel={() => setmodal({open: false})}
           onSelection={(resources) => handleSelection(resources)}
        />
      <Layout>
        {emptyState ? 
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
          :
          <ProductList/>
        }
      </Layout>
    </Page>
  )
} 

export default Index;


