// Anchor program scaffold (extended)
use anchor_lang::prelude::*;

declare_id!("ChainWill1111111111111111111111111111111111");

#[program]
pub mod chain_will {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>, _bump: u8) -> Result<()> {
        Ok(())
    }

    pub fn create_will(ctx: Context<CreateWill>, beneficiary: Pubkey, inactivity_days: u64, challenge_seconds: u64) -> Result<()> {
        let will = &mut ctx.accounts.will;
        will.beneficiary = beneficiary;
        will.inactivity_days = inactivity_days;
        will.owner = *ctx.accounts.owner.key;
        will.created_at = Clock::get()?.unix_timestamp as u64;
        will.state = WillState::Active as u8;
        will.proposed_at = 0;
        will.challenge_seconds = challenge_seconds;
        Ok(())
    }

    // Owner or monitor can propose execution when conditions met (offchain monitor triggers)
    pub fn propose_execute(ctx: Context<ProposeExecute>) -> Result<()> {
        let will = &mut ctx.accounts.will;
        require!(will.state == WillState::Active as u8, ErrorCode::InvalidState);
        will.proposed_at = Clock::get()?.unix_timestamp as u64;
        will.state = WillState::Proposed as u8;
        Ok(())
    }

    // Anyone (relayer) can finalize after challenge window
    pub fn finalize_execute(ctx: Context<FinalizeExecute>) -> Result<()> {
        let will = &mut ctx.accounts.will;
        require!(will.state == WillState::Proposed as u8, ErrorCode::InvalidState);
        let now = Clock::get()?.unix_timestamp as u64;
        require!(will.proposed_at > 0, ErrorCode::NotProposed);
        require!(now >= will.proposed_at.checked_add(will.challenge_seconds).unwrap_or(u64::MAX), ErrorCode::ChallengeNotExpired);
        // transfer lamports from will account to beneficiary
        **ctx.accounts.will.to_account_info().try_borrow_mut_lamports()? -= ctx.accounts.will.to_account_info().lamports();
        **ctx.accounts.beneficiary.to_account_info().try_borrow_mut_lamports()? += ctx.accounts.will.to_account_info().lamports();
        will.state = WillState::Executed as u8;
        Ok(())
    }

    // Owner can cancel before execution
    pub fn cancel_will(ctx: Context<CancelWill>) -> Result<()> {
        let will = &mut ctx.accounts.will;
        require!(will.state == WillState::Active as u8 || will.state == WillState::Proposed as u8, ErrorCode::InvalidState);
        // transfer lamports back to owner
        **ctx.accounts.will.to_account_info().try_borrow_mut_lamports()? -= ctx.accounts.will.to_account_info().lamports();
        **ctx.accounts.owner.to_account_info().try_borrow_mut_lamports()? += ctx.accounts.will.to_account_info().lamports();
        will.state = WillState::Cancelled as u8;
        Ok(())
    }
}

#[account]
pub struct Will {
    pub owner: Pubkey,
    pub beneficiary: Pubkey,
    pub inactivity_days: u64,
    pub created_at: u64,
    pub state: u8,
    pub proposed_at: u64,
    pub challenge_seconds: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub enum WillState {
    Inactive = 0,
    Active = 1,
    Proposed = 2,
    Executed = 3,
    Cancelled = 4,
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct CreateWill<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 32 + 8 + 8 + 1 + 8 + 8)]
    pub will: Account<'info, Will>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProposeExecute<'info> {
    #[account(mut, has_one = owner)]
    pub will: Account<'info, Will>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct FinalizeExecute<'info> {
    #[account(mut)]
    pub will: Account<'info, Will>,
    /// CHECK: beneficiary lamports receive
    #[account(mut)]
    pub beneficiary: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CancelWill<'info> {
    #[account(mut, has_one = owner)]
    pub will: Account<'info, Will>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid state for this operation")] 
    InvalidState,
    #[msg("Will not yet proposed")] 
    NotProposed,
    #[msg("Challenge window not expired")] 
    ChallengeNotExpired,
}
