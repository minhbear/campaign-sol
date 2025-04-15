use anchor_lang::prelude::*;

use crate::state::Campaign;

pub fn process(
    ctx: Context<UpdateCampaign>,
    name: String,
    cta_link: String,
    logo: String
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;

    campaign.data.name = name;
    campaign.data.cta_link = cta_link;
    campaign.data.logo = logo;

    msg!("Campaign updated successfully!");

    Ok(())
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct UpdateCampaign<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        seeds = [b"campaign", campaign_id.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
}
