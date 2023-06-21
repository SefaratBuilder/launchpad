import { useWeb3React } from "@web3-react/core";
import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { networks } from "../constants/networksInfo";
import { utils } from "../utils";
import { useApplicationContext } from "./applicationContext";
import { request, gql } from 'graphql-request'
import { useQuery } from "@tanstack/react-query";
import { GET_ALL_LAUNCHPAD_INFO, GET_ALL_LOCKER } from "../graphql/launchpad";
import { ContactlessOutlined } from "@mui/icons-material";


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
      ipfsInfuraDedicatedGateway,
    },
    idoGraph,
    lockerGraph
  } = useApplicationContext();
  //pool data
  const { data, refetch } = useQuery({
    queryKey: ['pools',idoGraph],
    queryFn: async () => 
      await request(
        process.env.REACT_APP_IDO_GRAPH_URL,
        GET_ALL_LAUNCHPAD_INFO
      )
  }, {
    enabled: !!idoGraph
  })
  
  useEffect(() => {
    setPoolDatas(data?.idopools)
  }, [data])


  useEffect(() => {
    if (poolDatas) {
      (async () => {
        await Promise.all(
          poolDatas.map(async (item) => {
            const poolData = await utils.loadPoolData(item, contract.web3, ipfsInfuraDedicatedGateway).then((IDOPoolData) => {

              setAllPools((p) => ({ ...p, ...{ [IDOPoolData.id]: IDOPoolData } }));
            })
            return { ...item, poolData }
          }),
        )
      })()
    }
  }, [poolDatas])

  //locker data
  const { data: lockerData } = useQuery({
    queryKey: ['lockers',lockerGraph],
    queryFn: async () =>
      request(
        lockerGraph,
        GET_ALL_LOCKER
      ),
  },{
    enabled: !!lockerGraph
  })
  useEffect(() => {
    setLockerDatas(lockerData?.lockers)
  }, [lockerData])

  useEffect(() => {
    if (lockerDatas) {
      (async () => {
        await Promise.all(
          lockerDatas.map(async (item) => {
            const lockerData = await utils.getLockerData(item, contract.web3).then((LockerData) => {

              setAllLocker((l) => ({ ...l, ...{ [LockerData.lockerAddress]: LockerData } }));

            })
            return { ...item, lockerData }
          }),
        )
      })()
    }
  }, [lockerDatas])


  const value = {
    refetch,
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
