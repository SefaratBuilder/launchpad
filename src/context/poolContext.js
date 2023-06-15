import { useWeb3React } from "@web3-react/core";
import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { networks } from "../constants/networksInfo";
import { utils } from "../utils";
import { useApplicationContext } from "./applicationContext";
import { request, gql } from 'graphql-request'
import { useQuery } from "@tanstack/react-query";
import { GET_ALL_LAUNCHPAD_INFO, GET_ALL_LOCKER } from "../graphql/launchpad";


export const PoolContext = createContext({});

export const PoolContextProvider = ({ children }) => {
  const [allPoolAddress, setAllPoolAddress] = useState([]);
  const [poolDatas, setPoolDatas] = useState();
  const [lockerDatas, setLockerDatas] = useState();
  const [userPoolAddresses, setUserPoolAddresses] = useState([]);
  const [allPools, setAllPools] = useState({});

  const [allLockerAddress, setAllLockerAddress] = useState([]);
  const [userLockersAddresses, setUserLockersAddresses] = useState([]);
  const [allLocker, setAllLocker] = useState({});

  const dispatch = useDispatch();
  const contract = useSelector((state) => state.contract);
  const { account, chainId } = useWeb3React();

  const {
    domainSettings: {
      ipfsInfuraDedicatedGateway
    }
  } = useApplicationContext();


  //pool data
  const { data } = useQuery({
    queryKey: ['pools'],
    queryFn: async () =>
      request(
        "https://api.studio.thegraph.com/query/48288/bsc-testnet-ido-factory/version/latest",
        GET_ALL_LAUNCHPAD_INFO
      ),
  })
  useEffect(() => {
    setPoolDatas(data?.idopools)
  }, [data])
  

  useEffect(() => {
    if (poolDatas) {
      (async () => {
        await Promise.all(
          poolDatas.map(async (item) => {
            const poolData = await utils.loadPoolData(item).then((IDOPoolData) => {

              setAllPools((p) => ({ ...p, ...{ [IDOPoolData.id]: IDOPoolData } }));
            })
            return { ...item, poolData }
          }),
        )
      })()
    }
  }, [poolDatas])

  //locker data
  const {data: lockerData} =  useQuery({
    queryKey: ['lockers'],
    queryFn: async () =>
      request(
        'https://api.studio.thegraph.com/query/48288/locker-bsc-testnet/version/latest',
        GET_ALL_LOCKER
      ),
  })
  useEffect(() => {
    setLockerDatas(lockerData?.lockers)
  }, [lockerData])

  useEffect(() => {
    if (lockerDatas) {
      (async () => {
        await Promise.all(
          lockerDatas.map(async (item) => {
            const lockerData = await utils.getLockerData(item).then((LockerData) => {

              setAllLocker((l) => ({ ...l, ...{ [LockerData.lockerAddress]: LockerData } }));
             
            })
            return { ...item, lockerData }
          }),
        )
      })()
    }
  }, [lockerDatas])
 

  const value = {
    allPools,
    allPoolAddress,
    userPoolAddresses,
    allLocker,
    allLockerAddress,
    userLockersAddresses,
  };
  return <PoolContext.Provider value={value}>{children}</PoolContext.Provider>;
};

export const usePoolContext = () => React.useContext(PoolContext);
