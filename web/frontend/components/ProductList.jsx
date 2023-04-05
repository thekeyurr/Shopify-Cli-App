
import { useQuery,gql } from '@apollo/client';
import store from 'store-js';

const GET_PRODUCTS_BY_ID = gql`
query getProducts($ids: [ID!]!) {
  nodes(ids: $ids) {
		... on Product {
      id
      title
      handle
      
      images(first: 1) {
        edges {
          node {
            id
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


function ProductList() {

  console.log("GET_PRODUCTS_BY_ID===============",GET_PRODUCTS_BY_ID);

  const store_id = store.get('ids');
  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_ID, {
    variables: { ids: store_id }
  });
  
  console.log("store_id",store_id);
  console.log('this is data',data);
  if (loading) return <div>Loading.....</div>
  if (error) return <div>{error.message}</div>


  return (
    <div>  
        <h1>This is a Keyur's App</h1>
    </div>
    );

}



export default ProductList;



