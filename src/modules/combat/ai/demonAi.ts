import type { DemonDef, SkillDef } from '@/types/combat';

export function chooseAction(demon: DemonDef, state: { playerHpPct: number; demonHpPct: number; turn: number }, skills: Record<string, SkillDef>): SkillDef | undefined {
  const hp = state.demonHpPct;
  const pool = demon.moveset
    .map(id => skills[id])
    .filter(Boolean) as SkillDef[];
  if (!pool.length) return undefined;
  // Simple profiles
  if (demon.aiProfile === 'aggressive') {
    // prefer highest single-target damage skills (heuristic: not buff/debuff)
    return pool.find(s => s.tags.includes('single')) || pool[0];
  }
  if (demon.aiProfile === 'defensive') {
    if (hp < 0.4) {
      const guard = pool.find(s => s.effectKey === 'guard');
      if (guard) return guard;
    }
    return pool[0];
  }
  // tricky
  const debuff = pool.find(s => s.tags.includes('debuff'));
  if (hp > 0.6 && debuff) return debuff;
  return pool[0];
}
