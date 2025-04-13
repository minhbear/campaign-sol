import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import * as borsh from "@coral-xyz/borsh";

const connection = new Connection(clusterApiUrl("devnet"));
const programId = new PublicKey("7NafQywy9WpBDJRoXYrVtV7RfdudJ1jS66cagTDthezm");

const campaignStatusSchema = borsh.rustEnum([
  borsh.struct([], "Upcoming"),
  borsh.struct([], "Ongoing"),
  borsh.struct([], "Completed"),
  borsh.struct([], "Cancelled"),
]);

const borshCampaignDataSchema = borsh.struct([
  borsh.str("name"),
  borsh.str("ctaLink"),
  borsh.str("logo"),
  borsh.u64("startDate"),
  borsh.u64("endDate"),
  borsh.u64("budget"),
  borsh.u64("ratePerClick"),
  borsh.u64("clicks"),
  borsh.u64("remainingBudget"),
  campaignStatusSchema.replicate("status"),
]);

const borshCampaignSchema = borsh.struct([
  borsh.u64("campaignId"),
  borsh.publicKey("advertiser"),
  borshCampaignDataSchema.replicate("campaignData"),
]);

const deserializeCampaignData = (buffer: Buffer) => {
  const bufferWithDiscriminator = buffer.subarray(8);
  const data = borshCampaignSchema.decode(bufferWithDiscriminator);
  console.log("🚀 ~ deserializeCampaignData ~ data:", data);
};

const getCampaignData = async (campaignId: number) => {
  const campaignIdBuffer = Buffer.alloc(8);
  campaignIdBuffer.writeBigUInt64LE(BigInt(campaignId));
  const seeds = [Buffer.from("campaign"), campaignIdBuffer];
  const campaignPDA = PublicKey.findProgramAddressSync(seeds, programId)[0];

  const campaignDataRawBytes = (await connection.getAccountInfo(campaignPDA))
    .data;

  deserializeCampaignData(campaignDataRawBytes);
};

getCampaignData(1);
