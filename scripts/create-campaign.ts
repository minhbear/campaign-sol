import * as dotenv from "dotenv";
dotenv.config();

import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import bs58 from "bs58";
import { Program } from "@coral-xyz/anchor";
import { Campaign } from "../target/types/campaign";
import idl from "../target/idl/campaign.json";
import { BN } from "bn.js";

const connection = new Connection(clusterApiUrl("devnet"));
const creator = Keypair.fromSecretKey(
  bs58.decode(process.env.CREATOR_SECRET_KEY || "")
);
const program = new Program<Campaign>(JSON.parse(JSON.stringify(idl)), {
  connection,
});

(async () => {
  const campaignId = 1;
  const campaignIdBuffer = Buffer.alloc(8);
  campaignIdBuffer.writeBigUInt64LE(BigInt(campaignId));

  const seeds = [Buffer.from("campaign"), campaignIdBuffer];
  const campaignPDA = PublicKey.findProgramAddressSync(
    seeds,
    program.programId
  )[0];
  console.log("🚀 ~ campaignPDA:", campaignPDA.toBase58());

  const transaction = await program.methods
    .createCampaign(new BN(campaignId))
    .accountsPartial({
      creator: creator.publicKey,
      campaign: campaignPDA,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  const txHash = await sendAndConfirmTransaction(connection, transaction, [
    creator,
  ]);
  console.log("🚀 ~ txHash:", txHash);
})();
