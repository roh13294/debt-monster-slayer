import { BalanceConfig, getElementMatrixMultiplier } from './balance';
import type { Element, Stats, SkillDef, DemonDef, BattleOutcome } from '@/types/combat';
import * as SkillsData from '@/data/skills.json';

export interface EngineEntities { player: Stats; demon: Stats & { id?: string } }
export interface EngineFlags { playerGuard?: boolean; demonGuard?: boolean }
export interface DoT { target: 'player'|'demon'; dmg: number; turns: number }
export interface EngineState {
  seed: number;
  turn: 'player'|'demon';
  entities: EngineEntities;
  flags: EngineFlags;
  dots: DoT[];
  log: string[];
  fleeAttempted?: boolean;
}

export type PlayerAction =
  | { type: 'attack'; skillId?: string }
  | { type: 'guard' }
  | { type: 'flee' };

export function rollRng(seed: number): { nextSeed: number; r: number } {
  // LCG parameters (Numerical Recipes)
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;
  const nextSeed = (a * seed + c) % m;
  const r = nextSeed / m;
  return { nextSeed, r };
}

export function calcTurnOrder(pSpeed: number, dSpeed: number, seed: number): { first: 'player'|'demon'; seed: number } {
  if (pSpeed === dSpeed) {
    const { nextSeed, r } = rollRng(seed);
    return { first: r < 0.5 ? 'player' : 'demon', seed: nextSeed };
  }
  return { first: pSpeed > dSpeed ? 'player' : 'demon', seed };
}

export function elementMod(attackerEl: Element, defenderEl: Element, defenderAffinity?: Partial<Record<Element, number>>): number {
  const matrixMul = getElementMatrixMultiplier(attackerEl, defenderEl);
  const affinityMul = defenderAffinity?.[attackerEl] ?? 1.0;
  return matrixMul * affinityMul;
}

export function calcDamage(params: {
  atk: number; def: number; critChance: number; critMult: number; elementMul: number; seed: number; targetGuarded?: boolean; armorPierce?: boolean;
}): { dmg: number; crit: boolean; seed: number } {
  const { atk, def, critChance, critMult, elementMul, targetGuarded, armorPierce } = params;
  let { seed } = params;
  // base formula: reduce defense a bit, ensure >=1
  const effectiveDef = armorPierce ? def * 0.2 : def * 0.5;
  let raw = Math.max(1, Math.floor(atk - effectiveDef));
  raw = Math.floor(raw * elementMul);
  let crit = false;
  const roll = rollRng(seed); seed = roll.nextSeed;
  if (roll.r < critChance) {
    crit = true;
    raw = Math.floor(raw * (critMult || BalanceConfig.baseCritMult));
  }
  if (targetGuarded) raw = Math.floor(raw * (1 - BalanceConfig.guardReduction));
  return { dmg: Math.max(0, raw), crit, seed };
}

function applyDot(state: EngineState): EngineState {
  if (!state.dots.length) return state;
  const newDots: DoT[] = [];
  let { player, demon } = state.entities;
  const log: string[] = [];
  for (const dot of state.dots) {
    if (dot.turns > 0) {
      if (dot.target === 'player') {
        player = { ...player, hp: Math.max(0, player.hp - dot.dmg) };
        log.push(`Player takes ${dot.dmg} damage over time.`);
      } else {
        demon = { ...demon, hp: Math.max(0, demon.hp - dot.dmg) };
        log.push(`Demon takes ${dot.dmg} damage over time.`);
      }
      if (dot.turns - 1 > 0) newDots.push({ ...dot, turns: dot.turns - 1 });
    }
  }
  return { ...state, entities: { player, demon }, dots: newDots, log: [...log, ...state.log] };
}

function resolveEffectKey(state: EngineState, actor: 'player'|'demon', skill?: SkillDef): EngineState {
  if (!skill) return state;
  const k = skill.effectKey;
  if (k === 'guard') {
    return actor === 'player' ? { ...state, flags: { ...state.flags, playerGuard: true } } : { ...state, flags: { ...state.flags, demonGuard: true } };
  }
  if (k === 'element_ice_dot') {
    // 3 turns of DoT for 5% of player's atk rounded
    const atk = state.entities.player.atk;
    const dmg = Math.max(1, Math.floor(atk * 0.15));
    const target: 'player'|'demon' = actor === 'player' ? 'demon' : 'player';
    return { ...state, dots: [...state.dots, { target, dmg, turns: 3 }], log: [`${skill.name} inflicts frost over time.`, ...state.log] };
  }
  return state;
}

export function applyPlayerAction(state: EngineState, action: PlayerAction, skills: Record<string, SkillDef>, demonDef?: DemonDef): { state: EngineState; seed: number } {
  let s = { ...state };
  let seed = s.seed;
  s.flags.playerGuard = false; // guard applies for the next incoming attack only

  if (action.type === 'flee') {
    const roll = rollRng(seed); seed = roll.nextSeed;
    const success = roll.r < BalanceConfig.fleeBaseChance;
    s.fleeAttempted = success;
    s.log = [success ? 'You fled successfully.' : 'Failed to flee.', ...s.log];
    return { state: s, seed };
  }

  if (action.type === 'guard') {
    s = resolveEffectKey(s, 'player', { id: 'guard', name: 'Guard', desc: '', cost: 0, cooldown: 0, tags: ['buff'], effectKey: 'guard' });
    s.log = ['You brace yourself for impact.', ...s.log];
    return { state: s, seed };
  }

  // attack
  const skill = action.skillId ? skills[action.skillId] : undefined;
  if (skill && skill.effectKey === 'guard') {
    s = resolveEffectKey(s, 'player', skill);
    return { state: s, seed };
  }

  const em = elementMod(s.entities.player.element, s.entities.demon.element, demonDef?.affinity);
  const { dmg, crit, seed: newSeed } = calcDamage({
    atk: s.entities.player.atk,
    def: s.entities.demon.def,
    critChance: s.entities.player.critChance,
    critMult: s.entities.player.critMult,
    elementMul: em,
    seed,
    targetGuarded: s.flags.demonGuard,
    armorPierce: skill?.effectKey === 'armor_pierce',
  });
  seed = newSeed;
  s.entities = { ...s.entities, demon: { ...s.entities.demon, hp: Math.max(0, s.entities.demon.hp - dmg) } };
  s.log = [`You hit for ${dmg}${crit ? ' (CRIT)' : ''}.`, ...s.log];
  if (skill) s = resolveEffectKey(s, 'player', skill);
  return { state: s, seed };
}

export function applyDemonAction(state: EngineState, skills: Record<string, SkillDef>, demonDef: DemonDef): { state: EngineState; seed: number } {
  let s = { ...state };
  let seed = s.seed;
  s.flags.demonGuard = false;
  // naive AI: pick first available or basic hit
  const moveId = demonDef.moveset[0];
  const skill = skills[moveId];
  const em = elementMod(s.entities.demon.element, s.entities.player.element, undefined);
  const { dmg, crit, seed: newSeed } = calcDamage({
    atk: s.entities.demon.atk,
    def: s.entities.player.def,
    critChance: s.entities.demon.critChance,
    critMult: s.entities.demon.critMult,
    elementMul: em,
    seed,
    targetGuarded: s.flags.playerGuard,
    armorPierce: skill?.effectKey === 'armor_pierce',
  });
  seed = newSeed;
  s.entities = { ...s.entities, player: { ...s.entities.player, hp: Math.max(0, s.entities.player.hp - dmg) } };
  s.log = [`${demonDef.name} hits for ${dmg}${crit ? ' (CRIT)' : ''}.`, ...s.log];
  if (skill) s = resolveEffectKey(s, 'demon', skill);
  return { state: s, seed };
}

export function checkOutcome(state: EngineState): BattleOutcome | null {
  if (state.fleeAttempted) return { outcome: 'flee' };
  if (state.entities.demon.hp <= 0) return { outcome: 'win' };
  if (state.entities.player.hp <= 0) return { outcome: 'lose' };
  return null;
}

export function createInitialState(player: Stats, demon: Stats, seed = BalanceConfig.rngSeedBase): EngineState {
  return { seed, turn: 'player', entities: { player, demon }, flags: {}, dots: [], log: [] };
}
