// import { useQuery,gql } from '@apollo/client';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import store from 'store-js';

const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {    
        title
        handle
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;



console.log("GET_PRODUCTS_BY_ID===============>", GET_PRODUCTS_BY_ID);


function ProductList() {

  const store_id = store.get('ids');
  const { loading, data, error, networkStatus } = useQuery(GET_PRODUCTS_BY_ID, {
    variable: { ids : store_id },
  })

  console.log("fetch the data to useQuery=================",useQuery(GET_PRODUCTS_BY_ID, {
    variables: { ids : store_id },
  }))

  console.log("Query: ============", GET_PRODUCTS_BY_ID);
  console.log("Variables: ============", { ids: store_id });
  console.log("loading======================",loading);
  console.log("data===================",data);
  console.log("networkStatus==========", networkStatus);

  return (
    <div>
        <h1>This is a Keyur's App</h1>
    </div>
    );
}

export default ProductList;





