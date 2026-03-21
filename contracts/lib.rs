// Anchor program scaffold (simplified)
use anchor_lang::prelude::*;

declare_id!("ChainWill1111111111111111111111111111111111");

#[program]
pub mod chain_will {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, _bump: u8) -> Result<()> {
        Ok(())
    }
    pub fn create_will(ctx: Context<CreateWill>, beneficiary: Pubkey, inactivity_days: u64) -> Result<()> {
        let will = &mut ctx.accounts.will;
        will.beneficiary = beneficiary;
        will.inactivity_days = inactivity_days;
        will.owner = *ctx.accounts.owner.key;
        will.created_at = Clock::get()?.unix_timestamp as u64;
        will.state = 0;
        Ok(())
    }
}

#[account]
pub struct Will {
    owner: Pubkey,
    beneficiary: Pubkey,
    inactivity_days: u64,
    created_at: u64,
    state: u8,
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct CreateWill<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 32 + 8 + 8 + 1)]
    pub will: Account<'info, Will>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
