import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import { Card, ResourceList, Stack, TextStyle, Thumbnail } from '@shopify/polaris';
import store from 'store-js';
import ApolloClient from "apollo-boost";
import Index from '../pages';




const GET_PRODUCTS_BY_ID =  gql`
query getProducts($ids: [ID!]!){
    nodes(ids: $ids){
      ... on Product{
        title
        handle
        id
        images(first: 1){
          edges{
            node{
              originalSrc
              altText
            }
          }
        }
        variants(first: 1){
        edges{
          node{
            price
            id
          }
        }
       }
      }
    }
  }
`


function ProductList(){
    return(
        <div>
            <h1>Hello i am keyur bavishi</h1>
        </div>
    )
}

export default ProductList;