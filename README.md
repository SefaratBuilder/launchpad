# IDOFactory

White-label Decentralized IDO Launchpad Platform

## Installation

1. Install dependencies

    ```bash
    yarn
    ```

2. Start app

    ```bash
    yarn start
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Launch and Setting Up Application

1. Set owner
    ![SetOwner](./docs/images/SetOwner.png)
2. Manage IPFS:
    ![ManageIPFS](./docs/images/ManageIPFS.png)
3. Manage network:
   ![ManageNetwork](./docs/images/ManageNetwork.png)
  * BSC test net:
  + RPC: https://data-seed-prebsc-1-s2.binance.org:8545
  + IDO Graph URL: https://api.studio.thegraph.com/query/48288/bsc-testnet-ido-factory/version/latest
  + Locker Graph URL: https://api.studio.thegraph.com/query/48288/locker-bsc-testnet/version/latest
  * Goerli test net:
  + RPC: https://rpc.ankr.com/eth_goerli
  + IDO Graph URL https://api.studio.thegraph.com/query/48674/ido-factory-goerli/version/latest
  + Locker Graph URL: https://api.studio.thegraph.com/query/48288/my-locker-factory/version/latest
4. Manage contract:
  ![ManageContract](./docs/images/ManageContract.png)
  * BSC test net:
  + Fee Token Address: 0xaD337556Adfa1a1DE33DEedB5Af27Cb99D6A954d
  + IDO Factory Address: 0x6FE13010f5D3f847539c1b6b4705006a47335718
  + Locker Factory Address: 0x2f91CC6529f91152999Aba81cdE0CaA98Ca3Ed65
  * Goerli test net:
  + Fee Token Address: 0x5197B8D0937375e828AE4A11a35d982594153797
  + IDO Factory Address: 0x515AD0745AF9BEE8B82D039314e5a50088F01e19
  + Locker Factory Address: 0x6268Ad78C5eD1E1cab8B51341639c20a78f4EDe9

## Add a new EVM-like chain

[Read](./docs/addNewNetwork.md)

## Images

1. Home page
    ![HomePage](./docs/images/HomePage.png)
1. Launchpad page
    ![LaunchpadPage](./docs/images/LaunchpadPage.png)
1. IDO info pages
    ![IDOInfoPage1](./docs/images/IDOInfoPage1.png)
    ![IDOInfoPage2](./docs/images/IDOInfoPage2.png)
1. Locker page
    ![LockerPage](./docs/images/LockerPage.png)
1. Locker info page
    ![LockerInfoPage](./docs/images/LockerInfoPage.png)
1. Account page
    ![AccountPage](./docs/images/AccountPage.png)
1. Create Launchpad Pool pages
    ![CreatePoolStep1](./docs/images/CreatePoolStep1.png)
    ![CreatePoolStep2](./docs/images/CreatePoolStep2.png)
    ![CreatePoolStep3](./docs/images/CreatePoolStep3.png)
    ![CreatePoolStep4_1](./docs/images/CreatePoolStep4_1.png)
    ![CreatePoolStep4_2](./docs/images/CreatePoolStep4_2.png)
1. Lock Token page
    ![LockToken](./docs/images/LockToken.png)
