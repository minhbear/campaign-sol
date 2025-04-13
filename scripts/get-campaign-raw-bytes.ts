import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const programId = new PublicKey("7NafQywy9WpBDJRoXYrVtV7RfdudJ1jS66cagTDthezm");

const readDataCampaign = (buffer: Buffer) => {
  const discrimator = buffer.subarray(0, 8);
  const campaignIdBuffer = buffer.subarray(8, 8 + 8);
  const advertiserBuffer = buffer.subarray(8 + 8, 8 + 8 + 32);

  const advertiser = new PublicKey(advertiserBuffer);
  console.log(
    "🚀 ~ readDataCampaign ~ campaignId: ",
    campaignIdBuffer.readBigUInt64LE()
  );
  console.log("🚀 ~ readDataCampaign ~ advertiser:", advertiser.toBase58());
};

const getCampaignData = async (campaignId: number) => {
  const campaignIdBuffer = Buffer.alloc(8);
  campaignIdBuffer.writeBigUInt64LE(BigInt(campaignId));
  const seeds = [Buffer.from("campaign"), campaignIdBuffer];
  const campaignPDA = PublicKey.findProgramAddressSync(seeds, programId)[0];

  const campaignDataRawBytes = (await connection.getAccountInfo(campaignPDA))
    .data;
  console.log(
    "🚀 ~ getCampaignData ~ campaignDataRawBytes:",
    campaignDataRawBytes
  );

  readDataCampaign(campaignDataRawBytes);
};

getCampaignData(1);
