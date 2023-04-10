import TodoListJSON from './list.json';
import Web3 from 'web3';
const contract = require('@truffle/contract');

export const load = async () => {
  await loadWeb3();
  const addressAccount = await loadAccount();
  console.log('log--addressAccount ', addressAccount);
  console.log("log--window.web3 ", window.web3.eth);
  const { todoContract, tasks } = await loadContract(addressAccount);

  return { addressAccount, todoContract, tasks };
};

export const sendTransaction = async () => {
  window.web3.eth.sendTransaction(({
    from: "0xA487D311E1dBe2e43c9dD564A03b3B2B7FF1d7Ba",
    to: "0xdD346Df5d798829346474D67980E0AB49aAD99b9",
    value: 1e18 // 1 ETH
  }))
}

const loadAccount = async () => {
  const addressAccount = await window.web3.eth.getCoinbase();
  return addressAccount;
};

const loadTasks = async (todoContract, addressAccount) => {
  console.log('log--todoContract ', todoContract);
  const tasksCount = await todoContract.tasksCount(addressAccount);
  const tasks = [];
  console.log('log--tasksCount ', tasksCount);
  for (var i = 0; i < tasksCount; i++) {
    const task = await todoContract.tasks(addressAccount, i);
    tasks.push(task);
  }
  console.log('log--tasks-ne ', tasks);
  return tasks;
};

const loadContract = async (addressAccount) => {
  const theContract = contract(TodoListJSON);
  theContract.setProvider(window.web3.eth.currentProvider);
  const todoContract = await theContract.deployed();
  const tasks = await loadTasks(todoContract, addressAccount);

  return { todoContract, tasks };
};

const loadWeb3 = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
      window.web3.eth.sendTransaction({
        /* ... */
      });
    } catch (error) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    // Acccounts always exposed
    window.web3.eth.sendTransaction({
      /* ... */
    });
  }
  // Non-dapp browsers...
  else {
    console.log(
      'Non-Ethereum browser detected. You should consider trying MetaMask!'
    );
  }
};
