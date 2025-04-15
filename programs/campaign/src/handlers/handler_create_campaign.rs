use anchor_lang::prelude::*;

use crate::state::{ Campaign, CampaignData, CampaignStatus };

pub fn process(ctx: Context<CreateCampaign>, campaign_id: u64) -> Result<()> {
    let campaign_data = CampaignData {
        name: "MinhBear".to_string(),
        cta_link: "https://minhbear.com".to_string(),
        logo: "https://minhbear.com/logo.png".to_string(),
        start_date: 1744414234,
        budget: 1_000_000,
        clicks: 0,
        end_date: 1746055815,
        rate_per_click: 1_000,
        remaining_budget: 1_000_000,
        status: CampaignStatus::Upcoming,
    };

    ctx.accounts.campaign.set_inner(Campaign {
        campaign_id,
        advertiser: ctx.accounts.creator.key(),
        data: campaign_data,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct CreateCampaign<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Campaign::INIT_SPACE,
        seeds = [b"campaign", campaign_id.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,

    pub system_program: Program<'info, System>,
}
