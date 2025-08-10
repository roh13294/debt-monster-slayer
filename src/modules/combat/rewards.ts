import type { Rewards } from '@/types/combat';

export function calcRewards(params: { level: number; baseGold?: number }): Rewards {
  const { level, baseGold = 10 } = params;
  const xp = 30 + level * 15;
  const gold = baseGold + level * 10;
  const shards = level >= 5 ? 1 : 0;
  return { xp, gold, shards };
}
