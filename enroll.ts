import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL as Idl, Turbin3Prereq } from "./programs/Turbin3_prereq";

let wallet = require("./dev-wallet.json");

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet)); 

const connection = new Connection("https://api.devnet.solana.com");

const github = Buffer.from("alizeeshan1234", "utf8");

const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"}); 

const program: Program<Turbin3Prereq> = new Program(Idl, provider);

const enrollment_seeds = [Buffer.from("pre"), keypair.publicKey.toBuffer()]; 
    
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(enrollment_seeds, program.programId); 

(async () => {
    try {
        const txhash = await program.methods.submit(github).accounts({
            signer: keypair.publicKey,
        }).signers([keypair]).rpc();
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`); 
    }catch(e) { 
        console.error(`Oops, something went wrong: ${e}`) 
    }
})();