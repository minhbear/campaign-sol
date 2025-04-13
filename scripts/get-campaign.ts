import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { Campaign } from "../target/types/campaign";
import idl from "../target/idl/campaign.json";

const connection = new Connection(clusterApiUrl("devnet"));
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

  const campaignData = await program.account.campaign.fetch(campaignPDA);

  console.log("Advertiser:", campaignData.advertiser.toBase58());
})();
