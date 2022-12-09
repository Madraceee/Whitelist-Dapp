import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract} from "ethers";
import { useEffect,useState,useRef } from "react";
import { WHITELIST_CONTRACT_ADDRESS,abi} from "../constants";

export default function Home(){

  // walletConnected - To keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnnected] = useState(false);

  // joinWhitelist - To keep track whether the currect wallet address has joined the whitelist or not
  const [joinWhitelist, setJoinWhitelist] = useState(false);

  // loading -  set to true while waiting for transaction to complete
  const [loading, setLoading] = useState(false);

  // numberOfWhitelisted - Holds the value of number of addresses part of the whitelist
  const [numberOfWhitelisted ,setNumberOfWhitelist] = useState(0);

  // Create a reference to the Web3 Modal
  const web3ModalRef = useRef();

  // Record transaction hash once transaction is done
  const [txHash, setTxHash] = useState(undefined)


  // To get provider and signer from the wallet

  const getProviderOrSigner  = async(needSigner = false) =>{

    // Connect to wallet
    // Obtaining a provider 
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // Since our contract is on the goerli network, the user should be connected to goerli network
    const {chainId}  = await web3Provider.getNetwork();
    if( chainId!==5 ){
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }
    
    //If signer is requested, the funciton returns a signer
    if(needSigner){
      const signer = web3Provider.getSigner()
      return signer;
    }

    // A provider is returned
    return web3Provider;
  }


  const addAddressToWhitelist = async () =>{
    try{

      // Signer required to make a transaction
      const signer = await getProviderOrSigner(true);


      // Create a new instance of the contract with the signer
      const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          signer,
      );

      // calling addAddressToWhitelist function
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);  
      
      // waiting for transaction to get mined
      await tx.wait();
      setLoading(false);
      setTxHash(tx.hash);
      console.log("Hash",tx.hash);

      // get the updated number of address in the whitelist
      await getNumberOfWhiteListed();
      setJoinWhitelist(true);
    } catch(err){
      console.error(err);
    }
  }


  // To get the number of address which are whitelisted
  const getNumberOfWhiteListed = async () =>{
    try{
      
      // Provider is required to get details from the contract
      const provider = await getProviderOrSigner();

      // Create instance of the contract using provider
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      // Call numAddressesWhitelisted from contract
      const _numberOfWhiteListed = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelist(_numberOfWhiteListed);
    }catch(err){
      console.log(err);
    }
  }

  //Check if the address is in the whitelist

  const checkIfAddressInWhitelist = async () =>{
    try{

      // Using signer to get the user's address

      const signer = getProviderOrSigner(true);


      // Contract instance using signer
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      // To get the address of signer and saving in variable address
      const address = await signer.getAddress();

      const _joinedWhitelist = await whitelistContract.whitelistAddresses(address);
    }catch(err){
      console.error(err);
    }
  }

  // Connects to wallet

  const connectWallet = async ()=>{
    try{


      await getProviderOrSigner();
      setWalletConnnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhiteListed();
    }catch(err){
      console.error(err);
    }
  };


  // renderButton: Returns a button depending on the state of dapp

  
  const renderButton = () =>{
    if (walletConnected){
      if(joinWhitelist){
        return(
          <div>
            <div className={styles.description}>
            Thanks for joining Whitelist!
            </div>
            <div className={styles.description}>
              Transaction Hash is {txHash}
            </div>
          </div>          
        );
      }else if(loading){
        return <button  className={styles.button}>
        Loading...
      </button>
      }
    else{
      return(
        <button onClick={addAddressToWhitelist} className={styles.button}>
          Join the Whitelist
        </button>
      )
    }
    }else{
      return(
        <button onClick={connectWallet} className={styles.button}>
          Connect the Wallet
        </button>
      );
    }
  };

  useEffect(()=>{
    
    // If Web3Modal classs is not present, creating a new instance

    web3ModalRef.current = new Web3Modal({
      network:"goerli",
      providerOptions:{},
      disableInjectedProvider:false,
    });

    connectWallet();
  },[walletConnected]);

  return(
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
        By Nitheesh Raaja R
      </footer>
    </div>
  )





};



