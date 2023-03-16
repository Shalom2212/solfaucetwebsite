import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from "react-bootstrap/Button";
import './Solana.css'

const SOLANA = require('@solana/web3.js');
const { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = SOLANA;
const SOLANA_CONNECTION = new Connection(clusterApiUrl('devnet'));
var WALLET_ADDRESS;
const AIRDROP_AMOUNT = 1 * LAMPORTS_PER_SOL;
let signature
let ermsg

function Solana(){


    const[address,setaddress] = React.useState({
        walletadd:""
    }
    )

    const[displaysig,setdisplaysig] = React.useState({
        request:false,
        error:false,
        sig:false
    })

    function handelchange(event){
        const{name,value} = event.target
        setaddress(prevdata=>{
            return{
                ...address,
                [name]:value
            }
        })
    }

    function airdrop(){
        (async () => {
            try{console.log(`Requesting airdrop for ${WALLET_ADDRESS}`)
            setdisplaysig(()=>{
                return{
                    request:true,
                    error:false,
                    sig:false
                }
            })
             signature = await SOLANA_CONNECTION.requestAirdrop(
                new PublicKey(WALLET_ADDRESS),
                AIRDROP_AMOUNT
            );
            const { blockhash, lastValidBlockHeight } = await SOLANA_CONNECTION.getLatestBlockhash();
            await SOLANA_CONNECTION.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature
            },'finalized');

            setdisplaysig(()=>{
                return{
                    request:false,
                    error:false,
                    sig:true
                }
            })
            
            console.log(`Tx Complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
            
            }
            catch(err){
                ermsg = err.message
                setdisplaysig(()=>{
                    return{
                        request:false,
                        error:true,
                        sig:false
                    }
                })
            }
            
        })();
    }

    function sendsol(event){
        event.preventDefault();
        console.log('sending')
        WALLET_ADDRESS = address.walletadd
        airdrop()
        setaddress(prevdata=>{
            return{
                walletadd:''
            }
        })
    }


    return(
        <div>
            <br/>
            <br/>
            <br/>
            <h1>It is a Solana development faucet airdrop 😄</h1>
            <span className="msg">Created by shalom 😎</span>
            <br/>
            <h2> 1 DEVNET SOL 💰</h2>
            <span className="msg">it is not a real sol! ⚠️</span>
            <h3>Enter your wallet address 👇:</h3>
            <br/>
            <form>
                <input 
                    type="text" 
                    placeholder="" 
                    className="form-input"
                    onChange={handelchange}
                    value={address.walletadd}
                    name="walletadd"
                />
                <br/>
                <div className="msg">
                    {displaysig.request?`Requesting airdrop for ${WALLET_ADDRESS}`:''}
                    {displaysig.error?`Error:${ermsg}`:''}
                    {displaysig.sig?`Transcation Complete 😄👍:`:''}
                    {displaysig.sig?<a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}>https://explorer.solana.com/tx/${signature}?cluster=devnet</a>:''}
                </div>
                <br/>
                <Button className="form-button" variant='success' onClick={sendsol}>Get sol</Button>
                
            </form>
        </div>
    )
}

export default Solana