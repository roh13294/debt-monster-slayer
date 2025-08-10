import create from 'zustand';
import type { BattleOutcome, Rewards, Stats } from '@/types/combat';
import { calcRewards } from '../rewards';

export type BattlePhase = 'IDLE'|'STARTING'|'PLAYER_TURN'|'DEMON_TURN'|'RESOLVE'|'CHECK_END'|'OUTCOME_EMITTED'|'RESULTS';

interface Entities { player: Stats|null; demon: Stats|null; demonId?: string }

interface BattleStore {
  phase: BattlePhase;
  uiLocked: boolean;
  outcomeEmitted: boolean;
  outcome?: BattleOutcome;
  rewards?: Rewards;
  nextRoute?: string;
  entities: Entities;
  startBattle: (demonId: string, entities: Entities) => void;
  emitOutcome: (outcome: BattleOutcome, rewards?: Rewards) => void;
  continue: () => string;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleStore>((set, get) => ({
  phase: 'IDLE',
  uiLocked: false,
  outcomeEmitted: false,
  entities: { player: null, demon: null },
  startBattle: (demonId, entities) => set({ phase: 'PLAYER_TURN', entities: { ...entities, demonId }, uiLocked: false, outcomeEmitted: false, outcome: undefined, rewards: undefined, nextRoute: undefined }),
  emitOutcome: (outcome, rewards) => {
    if (get().outcomeEmitted) return; // idempotent
    const nextRoute = outcome.outcome === 'win' ? '/episode/summary' : outcome.outcome === 'lose' ? '/recovery' : '/episodes';
    set({ outcomeEmitted: true, uiLocked: true, outcome, rewards: rewards ?? getRewardsFallback(), phase: 'OUTCOME_EMITTED', nextRoute });
    // auto transition to RESULTS within 300ms
    setTimeout(() => set({ phase: 'RESULTS' }), 300);
  },
  continue: () => {
    const { nextRoute } = get();
    // rewards granted once by emitOutcome; idempotent continue
    return nextRoute ?? '/episodes';
  },
  resetBattle: () => set({ phase: 'IDLE', uiLocked: false, outcomeEmitted: false, outcome: undefined, rewards: undefined, nextRoute: undefined, entities: { player: null, demon: null } })
}));

function getRewardsFallback(): Rewards {
  return calcRewards({ level: 1 });
}
