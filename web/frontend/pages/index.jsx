// import { EmptyState, Layout, Modal, Page, TextContainer } from "@shopify/polaris";
// import React,{ useCallback, useState } from "react";
// import { ResourcePicker } from "@shopify/app-bridge-react";
// import store from 'store-js';
// import ProductList from "../components/ProductList";

// function Index(){
//   // dynemic img 
//   const img = "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"

//   // resource picker component data
//   const [modal, setmodal]= useState({open: false});
//   const emptyState = !store.get('ids');


//   function handleSelection(resources){
//     const idsFromResources = resources.selection.map((product)=> product.id);
//     setmodal({open: false});
//     store.set('ids', idsFromResources)
//     console.log('this is product ids==========', store.get('ids'));
//   }

  
//   // ....................................
//   console.log("yes it's working");
//   const fetchCollection = async ()=>{
//     try {
//       const response = fetch('api/collection/433787502876');
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   fetchCollection();


//   // ....................................

//   return(
//     <Page>
//        <ResourcePicker 
//            resourceType="Product"
//            open={modal.open}
//            showVariants={false}
//            selectMultiple={true}
//            onCancel={() => setmodal({open: false})}
//            onSelection={(resources) => handleSelection(resources)}
//         />
//       <Layout>
//         {emptyState ? 
//           <EmptyState 
//             heading="Sample App"
//             action={{
//               content: 'Select Products',
//               onAction : () => setmodal({open: true}, console.log(modal))
//             }}
//             image={img}
//           >
//             <p>Select Product</p>
//           </EmptyState>
//           :
//           <ProductList/>
//         }
//       </Layout>
//     </Page>
//   )
// } 

// export default Index;





import { EmptyState, Layout, Modal, Page, TextContainer } from "@shopify/polaris";
import React,{ useCallback, useState } from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";

function Index(){

  // dynemic img 
  const img = "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"

  // resource picker component data
  const [modal, setmodal]= useState({open: false});


  console.log("hello world2");

  const fetchcollection =async ()=>{
    try {
      const response = await fetch('api/collections/433787502876');
      console.log(await response.json());

    } catch (error) {
      console.log(error);
    }

  }

  fetchcollection();


  

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