import postgres from '/deps/postgres.ts';
import {getDbCredentials} from '/util/secrets.ts';

export async function getXp(guildId: bigint, userId: bigint) {
  return await sql`
    SELECT *
    FROM xp
    WHERE userId = ${userId.toString()}
      AND guildId = ${guildId.toString()}
    LIMIT 1
  `;
}

export async function getAll() {
  return await sql`
    SELECT *
    FROM xp
  `;
}

export async function awardXp(guildId: bigint, userId: bigint, amount: number) {
  return await sql`
    INSERT INTO xp (
      guildId, userId, xp
    )
    VALUES (
      ${guildId.toString()}, ${userId.toString()}, ${amount}
    )
    ON CONFLICT (guildId, userId)
    DO UPDATE
      SET xp = xp.xp + ${amount}
      WHERE xp.guildId = ${guildId.toString()}
        AND xp.userId = ${userId.toString()}
    RETURNING *
  `;
}

export const sql = postgres(
  {
    host: 'localhost',
    database: 'oneup',
    ...getDbCredentials(),
  }
)
