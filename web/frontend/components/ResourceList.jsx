import {gql} from 'graphql-tag';
// import { useQuery } from '@apollo/react-hooks';
import { useQuery } from '@apollo/client';
import store from 'store-js';

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
  const {loading, error, data} = useQuery(GET_PRODUCTS_BY_ID, {variables: {id: store.get('ids')}})

  if(loading) return<div>Loading....</div>
  if(error)  return <div>{error.message}</div>

console.log("data ========",data);
    return(
        <div>
            <h1>Hello i am keyur bavishi</h1>

              {/* {
              data.node.map(item=>{
                return(
                  <p key={item.id}>{item.title}</p>
                )
              })
            } */}
        </div>
    )
}

export default ProductList;



