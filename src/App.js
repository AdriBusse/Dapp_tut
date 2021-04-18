import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';

//addres where the contract is deployed
const greeterAdress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
const tokenAdress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';

function App() {
  const [greeting, setGreeting] = useState('');
  const [sendToAccount, setSendToAccount] = useState('');
  const [amount, setAmount] = useState(0);

  const getBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      //gives you a array of active accounts in metamask
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      //provider is metamask for eg.
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //contract with pass the provider in
      const contract = new ethers.Contract(tokenAdress, Token.abi, provider);
      try {
        const balance = await contract.balanceOf(account);
        console.log(`Balance: ${balance.toString()}`);
      } catch (error) {
        console.log(`Error ${error}`);
      }
    }
  };

  const sendCoins = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      //provider is metamask for eg.
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //signer for interaction with the blockchain
      const signer = provider.getSigner();
      //contract with pass the signer in
      const contract = new ethers.Contract(tokenAdress, Token.abi, signer);
      //call the function in the contract
      const transaction = await contract.transfer(sendToAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins are sent to ${sendToAccount}`);
    }
  };

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //contract with pass the prvider in
      const contract = new ethers.Contract(
        greeterAdress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log(`data: ${data}`);
      } catch (error) {
        console.log(`Error ${error}`);
      }
    }
  };

  const setGreetingContract = async () => {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //signer is needed if transaction write to blockchain
      const signer = provider.getSigner();
      //contract with pass the signer in
      const contract = new ethers.Contract(greeterAdress, Greeter.abi, signer);
      //call contract function
      const transaction = await contract.setGreeting(greeting);

      setGreeting('');
      //waiting until it is confirmed in Blockchain
      await transaction.wait();
      fetchGreeting();
    }
  };

  //connect to the Metamask Account
  //accept a transaction
  const requestAccount = async () => {
    //prompt the user to connect to one of their account
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Greeting Contract</h1>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreetingContract}>Set Greeting</button>
        <input
          onChange={(e) => setGreeting(e.target.value)}
          placeholder="Set Greeting"
          value={greeting}
        ></input>
        <hr />
        <h1>Token Contract</h1>
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input
          onChange={(e) => setSendToAccount(e.target.value)}
          placeholder="Send to Address"
          value={sendToAccount}
        ></input>
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          value={amount}
        ></input>
      </header>
    </div>
  );
}

export default App;
