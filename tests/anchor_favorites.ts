import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorFavorites } from "../target/types/anchor_favorites";
import { assert } from "chai";

describe("anchor_favorites", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorFavorites as Program<AnchorFavorites>;

  // User wallet
  const user = provider.wallet;

  it("Sets the favorites!", async () => {
    // Derive PDA
    const [favoritesPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("Favorites"), user.publicKey.toBuffer()],
      program.programId
    );

    // Sample input
    const number = new anchor.BN(42);
    const color = "Blue";
    const hobbies = ["Reading", "Hiking", "Coding"];

    // Send transaction
    await program.methods
      .setFavorites(number, color, hobbies)
      .accounts({
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([]) // User is default signer
      .rpc();

    // Fetch account data
    const stored = await program.account.favourites.fetch(favoritesPda);

    assert.ok(stored.number.eq(number));
    assert.equal(stored.color, color);
    assert.deepEqual(stored.hobbies, hobbies);
  });
});
