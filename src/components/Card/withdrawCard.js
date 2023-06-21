import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import Countdown from "react-countdown";
import { useApplicationContext } from "../../context/applicationContext";
import { usePoolContext } from "../../context/poolContext";
import { useIDOPoolContract } from "../../hooks/useContract";
import * as s from "../../styles/global";
import { utils } from "../../utils";
import Loader from "../Loader";

const WithdrawETH = (props) => {
  const { account, library } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [loadingWithDraw, setLoadingWithDraw] = useState(false);
  const { idoAddress } = props;

  const {
    triggerUpdateAccountData,
    baseCurrencySymbol,
    TokenLockerFactoryContract,
  } = useApplicationContext();

  const idoInfo = usePoolContext().allPools[idoAddress];
  const IDOPoolContract = useIDOPoolContract(idoAddress);
  const refetch = usePoolContext().refetch;
  if (!account || !idoInfo || !library.web3) {
    return null;
  }

  // if (!utils.isValidPool(idoInfo)) {
  //   return null;
  // }

  if (idoInfo.owner.toLowerCase() !== account.toLowerCase()) {
    return null;
  }

  const withdrawETH = async () => {
    setLoadingWithDraw(true); // TODO: add action loader to the appropriate button
    try {
      const isNeedLocker = parseInt(idoInfo.claim) > parseInt(Date.now() / 1000);

      const tx = await IDOPoolContract.withdrawETH({
        from: account,
        value: isNeedLocker ? await TokenLockerFactoryContract.fee() : 0,
      });

      const receipt = await tx.wait();

      triggerUpdateAccountData();
      refetch()
      // TODO: add trigger for update IDOInfo after actions
      console.log("withdrawETH receipt", receipt);
    } catch (err) {
      console.log("withdrawETH Error: ", err);
    } finally {
      setLoadingWithDraw(false);
    }
  };

  const withdrawToken = async () => {
    setLoading(true); // TODO: add action loader to the appropriate button
    try {
      const tx = await IDOPoolContract.refundTokens({
        from: account,
      });

      const receipt = await tx.wait();

      triggerUpdateAccountData();
      refetch()
      // TODO: add trigger for update IDOInfo after actions
      console.log("withdrawToken receipt", receipt);
    } catch (err) {
      console.log("withdrawToken Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const withdrawUnsoldToken = async () => {
    setLoading(true); // TODO: add action loader to the appropriate button
    try {
      const tx = await IDOPoolContract.withdrawNotSoldTokens({
        from: account,
      });

      const receipt = await tx.wait();

      triggerUpdateAccountData();
      // TODO: add trigger for update IDOInfo after actions
      console.log("withdrawUnsoldToken receipt", receipt);
      refetch()
    } catch (err) {
      console.log("withdrawUnsoldToken Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  const hasEnded = parseInt(idoInfo.end) < parseInt(Date.now() / 1000);

  return (
    <s.Card
      style={{
        minWidth: 350,
        flex: 1,
        margin: 10,
      }}
    >
      <s.TextTitle>WITHDRAW</s.TextTitle>
      <s.TextID>(Pool owner only)</s.TextID>
      <s.SpacerSmall />
      {
        !hasEnded && (
          <s.Container fd="row" ai="center" jc="space-between">
            <s.Container flex={3}>
              <s.TextID>Can withdraw in</s.TextID>
            </s.Container>

            <Countdown date={idoInfo.end * 1000} />
          </s.Container>
        )
      }
      <s.SpacerMedium />
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={2}>
          <s.TextID>Total invested</s.TextID>
          <s.TextDescription>
            {BigNumber(library.web3.utils.fromWei(idoInfo.totalInvestedETH)).toFixed(2) +
              " " +
              baseCurrencySymbol}
          </s.TextDescription>
        </s.Container>
        <s.button
          disabled={
            !hasEnded ||
            BigNumber(idoInfo.totalInvestedETH).lt(BigNumber(idoInfo.softCap)) ||
            idoInfo.distributed
          }
          onClick={(e) => {
            e.preventDefault();
            withdrawETH();
          }}
        >
          {!loadingWithDraw ? 'WITH DRAW' :
            (<div style={{ paddingBottom: '3px' }}><Loader size="24px" /></div>)}
        </s.button>
      </s.Container>
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={2}>
          <s.TextID>Unsold token</s.TextID>
          <s.TextDescription>
            {BigNumber(idoInfo.unsold)
              .dividedBy(10 ** idoInfo.tokenDecimals)
              .toFixed(2) +
              " " +
              idoInfo.tokenSymbol}
          </s.TextDescription>
        </s.Container>
        {BigNumber(idoInfo.totalInvestedETH).lt(BigNumber(idoInfo.softCap)) ? (
          <s.button
            disabled={
              !hasEnded ||
              !BigNumber(idoInfo.totalInvestedETH).lt(BigNumber(idoInfo.softCap)) ||
              (!idoInfo.unsold || idoInfo.unsold == "0")
            }
            onClick={(e) => {
              e.preventDefault();
              withdrawToken();
            }}
          >
            {!loading ? 'WITHDRAW ALL TOKEN' :
              (<div style={{ paddingBottom: '3px' }}><Loader size="24px" /></div>)}
          </s.button>
        ) : (
          <s.button
            disabled={
              !hasEnded ||
              !idoInfo.distributed ||
              (!idoInfo.unsold || idoInfo.unsold == "0")
            }
            onClick={(e) => {
              e.preventDefault();
              withdrawUnsoldToken();
            }}
          >
            {!loading ? 'WITHDRAW UNSOLD TOKEN' :
              (<div style={{ paddingBottom: '3px' }}><Loader size="24px" /></div>)}
          </s.button>
        )}
      </s.Container>
    </s.Card>
  );
};
export default WithdrawETH;
