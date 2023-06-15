import { ApolloClient, InMemoryCache } from '@apollo/client'
// https://api.studio.thegraph.com/query/48288/ido-factory/version/latest

const baseUrl =
  `https://api.studio.thegraph.com/query/48288/ido-factory/version/latest`
const client = new ApolloClient({
  uri: baseUrl,
})

export default client