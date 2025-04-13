use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    pub campaign_id: u64,
    pub advertiser: Pubkey,
    pub data: CampaignData,
}

#[derive(
    Clone,
    InitSpace,
    Debug,
    Eq,
    PartialEq,
    anchor_lang::AnchorDeserialize,
    anchor_lang::AnchorSerialize
)]
pub struct CampaignData {
    #[max_len(50)]
    pub name: String,
    #[max_len(50)]
    pub cta_link: String,
    #[max_len(50)]
    pub logo: String,
    pub start_date: u64,
    pub end_date: u64,
    pub budget: u64,
    pub rate_per_click: u64,
    pub clicks: u64,
    pub remaining_budget: u64,
    pub status: CampaignStatus,
}

#[derive(
    InitSpace,
    Clone,
    Debug,
    Eq,
    PartialEq,
    anchor_lang::AnchorDeserialize,
    anchor_lang::AnchorSerialize
)]
pub enum CampaignStatus {
    Upcoming,
    Ongoing,
    Completed,
    Cancelled,
}
