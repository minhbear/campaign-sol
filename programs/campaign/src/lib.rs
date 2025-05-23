use anchor_lang::prelude::*;

mod state;
mod handlers;
use handlers::*;

declare_id!("7NafQywy9WpBDJRoXYrVtV7RfdudJ1jS66cagTDthezm");

#[program]
pub mod campaign {
    use super::*;

    pub fn create_campaign(ctx: Context<CreateCampaign>, campaign_id: u64) -> Result<()> {
        handler_create_campaign::process(ctx, campaign_id)
    }

    pub fn update_campaign(
        ctx: Context<UpdateCampaign>,
        _campaign_id: u64,
        name: String,
        cta_link: String,
        logo: String
    ) -> Result<()> {
        handler_update_campaign::process(ctx, name, cta_link, logo)
    }
}
