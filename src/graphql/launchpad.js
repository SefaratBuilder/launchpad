
import {  gql } from 'graphql-request'

const GET_ALL_LAUNCHPAD_INFO =
  gql`
query {
  idopools(first: 10) {
    id
    dexInfo {
      factory
      router
      weth
    }
    owner
    distributed
    distributedTokens
    finInfo {
      hardCap
      listingPrice
      lpInterestRate
      maxEthPayment
      minEthPayment
      softCap
      tokenPrice
    }
    lockerFactory
    metadataURL
    rewardToken
    tokensForDistribution
    timestamps {
      endTimestamp
      startTimestamp
      unlockTimestamp
    }
    totalInvestedETH
    userInfos(first: 10) {
      id
      debt
      total
      totalInvestedETH
    }   
  }
}
`
const GET_ALL_LOCKER = gql`
query{
  lockers(first: 10) {
    id
    name
    owner
    token
    withdrawTime
    withdrawer
  }
}`
export { GET_ALL_LAUNCHPAD_INFO,GET_ALL_LOCKER }
