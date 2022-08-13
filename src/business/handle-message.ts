import {getRandomNumber} from '/util/random.ts';
import {awardXpToUserInGuild, getLevelFromXp, getXpOfUserInGuild} from '/data/xp.ts';
import {getGuildXpRange, getChannelXpMultiplier, getRoleXpMultiplier} from '/data/multipliers.ts';
import {MessageContext} from '/business/message-context.ts';

export async function handleMessage({authorId, guildId, channelIds, roleIds}: MessageContext) {
  if (!guildId) {
    return;
  }

  const previousXp = await getXpOfUserInGuild(guildId, authorId);
  const previousLevel = getLevelFromXp(previousXp);

  const range = await getGuildXpRange(guildId);
  const rawXp = getRandomNumber(...range);

  const channelMultipliersPromise = Promise.all(channelIds.map(getChannelXpMultiplier));
  const roleMultipliersPromise = Promise.all(roleIds.map(getRoleXpMultiplier));

  const [channelMultipliers, roleMultipliers] = await Promise.all([
    channelMultipliersPromise, roleMultipliersPromise
  ]);

  const xp = [...channelMultipliers, ...roleMultipliers].reduce((sum, val) => sum * val, rawXp);

  await awardXpToUserInGuild(guildId, authorId, xp);

  return {
    oldLevel: previousLevel,
    newLevel: getLevelFromXp(previousXp + xp)
  }
}

export interface Update {
  oldLevel: number;
  newLevel: number;
}

export function shouldUpdate({oldLevel, newLevel}: Update) {
  return oldLevel !== newLevel;
}
