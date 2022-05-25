// constants
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import SmartContract from '../../contracts/NFTStackSmartContract.json';
// log
import {fetchData} from '../data/dataActions';

const connectRequest = () => {
  return {
    type: 'CONNECTION_REQUEST',
  };
};

const connectSuccess = (payload) => {
  return {
    type: 'CONNECTION_SUCCESS',
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: 'CONNECTION_FAILED',
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: 'UPDATE_ACCOUNT',
    payload: payload,
  };
};


// export const connect = () => {
//   return async (dispatch) => {
//     const providerOptions = {
//       walletconnect: {
//         package: WalletConnectProvider, // required
//         options: {
//           infuraId: "39f8d6d639634aa1a6dcb4e6f5040b9b", // required
//           provider:"walletconnect",
//           desktopLinks: [
//             "rainbow",
//             "metamask",
//             "argent",
//             "trust",
//             "imtoken",
//             "pillar",
//           ]
//         }
//       }
//     };
//
//     const web3Modal = new Web3Modal({
//       network: "mainnet", // optional
//       cacheProvider: false, // optional
//       providerOptions // required
//     });
//
//     const provider = await web3Modal.connect();
//
//     const web3 = new Web3(provider);
//
//     console.log({provider});
//     console.log({web3});
//   }
// }
export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    if (window.ethereum) {
      // const web3 = new Web3(window.ethereum);

      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: '39f8d6d639634aa1a6dcb4e6f5040b9b', // required
          },
        },
      };

      const web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: false, // optional
        providerOptions, // required
      });

      const provider = await web3Modal.connect();

      const web3 = new Web3(provider);
      console.log({provider});
      console.log(web3.eth);
      try {
        await window.ethereum.enable();
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        console.log(accounts);
        const networkId = await window.ethereum.request({
          method: 'net_version',
        });
        console.log(networkId);
        //const NetworkData = await SmartContract.networks[networkId];
        if (networkId === '4' || networkId === 4) {
          console.log('mtav');
          const SmartContractObj = new web3.eth.Contract(
              SmartContract.abi,
              '0x2931444b3F55c0fe66aB48F6fDE3020EBb7AC07e',
          );
          console.log({SmartContractObj});
          dispatch(
              connectSuccess({
                account: accounts[0],
                smartContract: SmartContractObj,
                web3: web3,
              }),
          );
          // Add listeners start
          window.ethereum.on('accountsChanged', (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          console.log('mtav 1');
          dispatch(connectFailed('Change network to Ethereum.'));
        }
      } catch (err) {
        console.log('mtav 2');
        dispatch(connectFailed('Something went wrong.'));
      }
    } else {
      console.log('mtav 3');
      dispatch(connectFailed('Install Metamask.'));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({account: account}));
    dispatch(fetchData(account));
  };
};
