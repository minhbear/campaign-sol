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
  const parser = borshCampaignSchema.decode(bufferWithDiscriminator);
  console.log(">>>>>>>>>", parser.campaignData.startDate);
  const data = {
    campaign_id: parser.campaignId,
    advertiser: parser.advertiser.toString(),
    name: parser.campaignData.name,
    cta_link: parser.campaignData.ctaLink,
    logo: parser.campaignData.logo,
    start_date: new Date(Number(parser.campaignData.startDate) * 1000),
    end_date: new Date(Number(parser.campaignData.endDate) * 1000),
    budget: parser.campaignData.budget,
    rate_per_click: parser.campaignData.ratePerClick,
    clicks: parser.campaignData.clicks,
  };
  console.log("🚀 ~ deserializeCampaignData ~ data:", data);
};

const getCampaignData = async (campaignId: number) => {
  const campaignIdBuffer = Buffer.alloc(8);
  campaignIdBuffer.writeBigUInt64LE(BigInt(campaignId));
  const seeds = [Buffer.from("campaign"), campaignIdBuffer];
  const campaignPDA = PublicKey.findProgramAddressSync(seeds, programId)[0];
  console.log("🚀 ~ getCampaignData ~ campaignPDA:", campaignPDA.toBase58());

  const campaignDataRawBytes = (await connection.getAccountInfo(campaignPDA))
    .data;

  deserializeCampaignData(campaignDataRawBytes);
};

getCampaignData(1);
