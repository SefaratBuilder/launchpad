import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useApplicationContext } from "../../context/applicationContext";
import { usePoolContext } from "../../context/poolContext";
import { useIDOPoolContract } from "../../hooks/useContract";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import { NumberField } from "../FormField";
import ProgressBar from "../Modal/ProgressBar";
import PoolCountdown from "../Utils/poolCountdown";
import Loader from "../Loader";

const BuyTokenCard = (props) => {
  const { account, library } = useWeb3React();
  const [ethAmount, setEthAmount] = useState("0");
  const [tokensToBuy, setTokensToBuy] = useState(0);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [loadingRefund, setLoadingRefund] = useState(false);
  const [error, setError] = useState(false);
  const { idoAddress } = props;
  const {
    triggerUpdateAccountData,
    baseCurrencySymbol
  } = useApplicationContext();
  const idoInfo = usePoolContext().allPools[idoAddress];
  const refetch = usePoolContext().refetch
  if (idoInfo) {
    idoInfo.userData = idoInfo.userData.filter((item) => {
      const owner = item.id.split('-')[0]
      return owner == account.toLowerCase()
    })
  }

  const IDOPoolContract = useIDOPoolContract(idoAddress);

  if (!account) {
    return null;
  }
  // if (!utils.isValidPool(idoInfo)) {

  //   return null;
  // }
  if (!idoInfo) {
    return <s.TextDescription fullWidth>Loading</s.TextDescription>;
  }
  if (!idoInfo?.userData) {
    return <s.TextDescription fullWidth>Loading</s.TextDescription>;
  }

  const buyToken = async () => {
    setLoadingBuy(true); // TODO: add action loader to the appropriate button
    try {
      const tx = await IDOPoolContract.pay({
        from: account,
        value: `0x${ethAmount.toString(16)}`,
      });

      const receipt = await tx.wait();

      triggerUpdateAccountData();
      // TODO: add trigger for update IDOInfo after actions
      console.log("buyToken receipt", receipt);
      refetch()
    } catch (err) {
      console.log("buyToken Error: ", err);
    } finally {
      setLoadingBuy(false);
    }
  };

  const claimToken = async () => {
    setLoadingClaim(true); // TODO: add action loader to the appropriate button
    try {
      const tx = await IDOPoolContract.claim({
        from: account,
      });

      const receipt = await tx.wait();

      triggerUpdateAccountData();
      // TODO: add trigger for update IDOInfo after actions
      console.log("claimToken receipt", receipt);
      refetch()

    } catch (err) {
      console.log("claimToken Error: ", err);
    } finally {
      setLoadingClaim(false);
    }
  };

  const refund = async () => {
    setLoadingRefund(true); // TODO: add action loader to the appropriate button
    try {
      const tx = await IDOPoolContract.refund({
        from: account,
      });

      const receipt = await tx.wait();

      triggerUpdateAccountData();
      // TODO: add trigger for update IDOInfo after actions
      console.log("refund receipt", receipt);
      refetch()

    } catch (err) {
      console.log("refund Error: ", err);
    } finally {
      setLoadingRefund(false);
    }
  };

  const isStarted = parseInt(idoInfo.start) < (parseInt(Date.now() / 1000));
  const hasEnded = parseInt(idoInfo.end) < (parseInt(Date.now() / 1000));
  const reachSoftCap = BigNumber(idoInfo.totalInvestedETH).gte(BigNumber(idoInfo.softCap));

  const willhMaxAmountOverflow = idoInfo.userData.totalInvestedETH > 0 ? BigNumber(ethAmount).gt(
    BigNumber(idoInfo.max).minus(BigNumber(idoInfo.userData[0]?.totalInvestedETH))
  ) : BigNumber(ethAmount).gt(BigNumber(idoInfo.max));
  const reachMaxAmount = BigNumber(idoInfo.max).lte(
    BigNumber(idoInfo.userData[0]?.totalInvestedETH)
  );
  const lessThanMinAmount = BigNumber(ethAmount).lt(BigNumber(idoInfo.min));

  return (
    <s.Card
      style={{
        minWidth: 350,
        flex: 1,
        margin: 10,
      }}
    >
      <s.TextTitle>BUY TOKEN</s.TextTitle>
      {hasEnded ? (
        <Badge bg="secondary">Ended</Badge>
      ) : isStarted ? (
        <Badge bg="success">Started</Badge>
      ) : (
        <Badge bg="secondary">Not started</Badge>
      )}
      <s.SpacerSmall />
      <PoolCountdown start={idoInfo.start} end={idoInfo.end} />
      <s.Container fd="row" jc="space-between" style={{ marginTop: 10 }}>
        <s.Card style={{ padding: 0 }}>
          <s.TextID>{"Minimum " + baseCurrencySymbol}</s.TextID>
          <s.TextDescription>
            {BigNumber(library.web3.utils.fromWei(idoInfo.min)).toFormat(2)}
          </s.TextDescription>
        </s.Card>
        <s.Card style={{ padding: 0 }}>
          <s.TextID>Maximum {baseCurrencySymbol}</s.TextID>
          <s.TextDescription>
            {BigNumber(library.web3.utils.fromWei(idoInfo.max)).toFormat(2)}
          </s.TextDescription>
        </s.Card>
      </s.Container>
      <s.Container fd="row" jc="space-between" ai="center">
        <s.Container flex={4}>
          <s.TextID>To claim</s.TextID>
          <s.TextDescription>

            {idoInfo.userData[0]?.debt ? BigNumber(idoInfo.userData[0]?.debt)
              .dividedBy(10 ** idoInfo.tokenDecimals)
              .toString() +
              " $" +
              idoInfo.tokenSymbol : 0}
          </s.TextDescription>
        </s.Container>
        <s.Container flex={1}>
          <s.button
            disabled={
              !hasEnded ||
              (hasEnded && !reachSoftCap) ||
              BigNumber(idoInfo.userData[0]?.debt).lte(0)
              || !idoInfo.userData[0]
            }
            onClick={(e) => {
              e.preventDefault();
              claimToken();
            }}
          >
            {!loadingClaim ? 'CLAIM' :
              (<div style={{ paddingBottom: '3px' }}><Loader size="24px" /></div>)}
          </s.button>
        </s.Container>
      </s.Container>
      <s.Container fd="row" jc="space-between" ai="center">
        <s.Container flex={4}>
          <s.TextID>My invested {baseCurrencySymbol}</s.TextID>
          <s.TextDescription>

            {idoInfo.userData[0]?.totalInvestedETH ? (BigNumber(library.web3.utils.fromWei(idoInfo.userData[0].totalInvestedETH)).toFormat(
              2
            ) + " " + baseCurrencySymbol) : '0.00'}
          </s.TextDescription>
        </s.Container>
        <s.Container flex={1}>
          <s.button
            disabled={
              !hasEnded ||
              BigNumber(idoInfo.totalInvestedETH).gte(
                BigNumber(idoInfo.softCap)
              ) ||
              BigNumber(idoInfo.userData[0]?.totalInvestedETH).lte(0)
              || !idoInfo.userData[0]?.totalInvestedETH
            }
            onClick={(e) => {
              e.preventDefault();
              refund();
            }}
          >
            {!loadingRefund ? 'REFUND' :
              (<div style={{ paddingBottom: '3px' }}><Loader size="24px" /></div>)}
          </s.button>
        </s.Container>
      </s.Container>
      <s.TextID>Progress</s.TextID>
      <s.SpacerSmall />
      <ProgressBar now={parseInt(idoInfo.progress)} />
      <s.SpacerMedium />
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={4} style={{ marginRight: 20 }}>
          <NumberField
            value={tokensToBuy}
            label={"Tokens amount"}
            adornment={idoInfo.tokenSymbol}
            onChange={(e) => {
              e.preventDefault();
              let val = BigNumber(e.target.value).toFixed(0);

              if (!isNaN(val)) {
                setTokensToBuy(val);
                setEthAmount(
                  BigNumber(idoInfo.tokenRate).times(val)
                );
              } else {
                setTokensToBuy(0);
                setEthAmount("0");
              }
            }}
          />
        </s.Container>
        <s.Container flex={1} ai="flex-end">
          <s.button
            disabled={
              hasEnded ||
              !isStarted ||
              tokensToBuy === 0 ||
              willhMaxAmountOverflow ||
              reachMaxAmount ||
              lessThanMinAmount
            }
            onClick={(e) => {
              e.preventDefault();
              buyToken();
            }}
          >
            {!loadingBuy ? 'BUY' :
              (<div style={{ paddingBottom: '3px' }}><Loader size="24px" /></div>)}
          </s.button>
        </s.Container>
      </s.Container>
      <s.SpacerSmall />

      <s.Container fd="row" jc="space-between" ai="center" style={{ wordBreak: "break-all" }} >
        <s.TextID>You will spend</s.TextID>
        {(ethAmount ? library.web3.utils.fromWei(ethAmount.toString(16)) : 0) +
          " " +
          baseCurrencySymbol
        }
      </s.Container>
    </s.Card>
  );
};
export default BuyTokenCard;
