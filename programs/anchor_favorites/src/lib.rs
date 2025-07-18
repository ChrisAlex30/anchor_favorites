use anchor_lang::prelude::*;

declare_id!("Fv4GQWceizLdxM4m9Z3evMvgaMvwCF9pqfvP6VqbdzJd");

pub const ANCHOR_DIS:usize=8;

#[program]
pub mod anchor_favorites {
    use super::*;

    pub fn set_favorites(ctx: Context<SetFavorites>,number:u64,color:String,hobbies:Vec<String>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        let user_public_key=ctx.accounts.user.key();
        msg!("User {user_public_key}, number is {number}, color is {color}, hobbies are {hobbies:?}");

        ctx.accounts.favorites.set_inner(Favourites { number, color, hobbies});
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Favourites{
    pub number:u64,

    #[max_len(50)]
    pub color:String,

    #[max_len(5,50)]
    pub hobbies:Vec<String>
}

#[derive(Accounts)]
pub struct SetFavorites<'info> {

    #[account(mut)]
    pub user:Signer<'info>,

    #[account(
        init,
        payer=user,space=ANCHOR_DIS+Favourites::INIT_SPACE,
        seeds=[b"Favorites",user.key().as_ref()],bump
    )]
    pub favorites:Account<'info,Favourites>,
    pub system_program:Program<'info,System>
}
