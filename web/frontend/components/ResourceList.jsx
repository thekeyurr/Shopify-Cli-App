import { useQuery,gql } from '@apollo/client';
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

const store_id = store.get('ids');

function ProductList() {

  const { loading, data, error } = useQuery(GET_PRODUCTS_BY_ID, {
    variables: { ids : store_id },

  })

  if (error) {
    console.log("GraphQL error:", error);
    return <div>{error.message}</div>;
  }

  console.log("store_get========",{ ids: store.get('ids') });
  if(loading) return <div>Loading...</div>

  
  if (!data) return <div>No data found</div>;
  console.log("data===========",data);


  return (
    <div>
      
      { loading ?
      (
        <p>Loading ...</p>
      ) :(
        <h1>This is a Keyur's App</h1>
      )}
    </div>
    );
}

export default ProductList;




