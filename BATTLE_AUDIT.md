# BATTLE_AUDIT.md

Battle Flow Audit — debt-monster-slayer (Slayr)

Scope
- Identify current battle UI, combat logic, and navigation hooks
- Locate all places HP can drop to ≤ 0 without triggering route change
- Note direct state mutations tied to UI components
- Record console errors seen during a sample battle session

1) Current Battle Surfaces (UI) and Responsibilities
- components/battle/BattleArena.tsx
  - Legacy arena with prepare → battle → result → loot phases; per‑debt loop via internal index
  - Triggers damage via context damageMonster and sets narrative/loot locally
  - Completion uses onComplete callback; no central router call
- components/battle/BattleArenaEnhanced.tsx
  - Primary arena used by EnhancedMonsterBattle (Dialog)
  - Integrates useBattleState (combos, overdrive, phases, log, missions)
  - Handles attack calc (calculateAttackDamage) then calls context damageMonster; victory path sets stage='loot'
  - No centralized state machine; UI controls remain active until component logic sets stage
- components/battle/BattleAttackControls.tsx
  - Attack/Special buttons, slider; disables only on insufficient cash/attacking
  - No awareness of outcome; no uiLocked guard
- components/battle/BattleControls.tsx
  - Alternate controls used by legacy BattleArena; similar behavior with local RNG and no outcome lock
- components/battle/BattleHUD.tsx, BattleHeader.tsx, BattleLog.tsx, BattleEvents.tsx
  - Display-only; no flow control
- components/EnhancedMonsterBattle.tsx
  - Dialog host switching between single battle, raid, and raid results
  - onComplete from BattleArenaEnhanced closes dialog and applies rewards; does not route to a Results surface automatically
- components/MonsterBattle.tsx
  - Older battle dialog with "Strike"; shows NarrativeMoment on victory; does not auto-route
- components/battle/MissionResults.tsx, RaidResultsScreen.tsx, BattleLootStage.tsx
  - Results-like UIs exist but are not wired into a deterministic end-of-battle transition for single battles

2) Combat Logic Locations (no pure/central engine yet)
- hooks/useBattleState.ts
  - Provides stance, combo, overdrive, phase checks; calculateAttackDamage uses Math.random and UI state
  - endBattle(bool) only resets local flags; no outcome emission/navigation
- hooks/useBattleActions.ts
  - Applies damage, deducts cash, updates debt, removes debt when balance hits 0 (after 500ms)
  - Also grants XP/coins; no event or routing emitted
  - Contains gameplay decisions inside UI hook (tight coupling)

3) Where HP ≤ 0 Can Occur Without Routing
- BattleArenaEnhanced.tsx
  - handleAttack → if (attackResult.damage >= debt.balance) handleVictory()
  - handleVictory(): setBattleStage('loot'); endBattle(true); no global outcome event, no router push, ActionPanel not globally locked
- useBattleActions.ts
  - damageMonster(): computes newBalance; if newBalance === 0 then setTimeout(() => removeDebt(debtId), 500)
  - No navigation or emitted outcome; components using this don’t automatically transition to a Results route
- MonsterBattle.tsx
  - handlePayment(): damageMonster(...); then sets narrativeType='victory'; no route/continue surface
- BattleArena.tsx (legacy)
  - handleDebtAttack(): if amount >= currentDebt.amount then generate loot and either advance to next debt or set battleResult='victory' and phase 'loot'
  - No central results route; action buttons can still be interacted with until phase toggles

Net effect: Multiple places determine defeat locally; none emit a single authoritative Outcome or route within ≤300ms. Panels may remain enabled briefly and can accept extra actions after lethal.

4) Direct State Mutations Tied to UI (to decouple into store/engine)
- BattleArenaEnhanced.tsx
  - setCash(), addNarratorMessage(), setTurnCounter(), setShowBurst/Slash/Shake(), local stage switches
- BattleControls.tsx / BattleAttackControls.tsx
  - Local RNG, cooldown visuals, and calls to onAttack/onSpecialMove; no shared lock state
- useBattleActions.ts
  - Game economy and debt removal decisions live here and are invoked directly from UI

5) Navigation Hooks / Routing
- EnhancedMonsterBattle.tsx
  - Modal open; onComplete → onClose(); no router push to a Results screen
- No centralized continue() handler or idempotent rewards gate exists yet

6) Console Errors Captured During Sample Battle
- Radix Dialog accessibility warnings (missing DialogTitle/Description)
  Stack (excerpt):
  Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.
  at @radix-ui/react-dialog.js:1413:36
  ...
  `DialogContent` requires a `DialogTitle` ... If you want to hide the `DialogTitle`, you can wrap it with VisuallyHidden.
  at @radix-ui/react-dialog.js:1399:30
- Image mapping logs (not errors): "Direct match found for ..."

7) Risks Causing “Stuck In Battle”
- No outcomeEmitted guard or UI lock; buttons remain active until local state switches
- Defeat/removal handled in useBattleActions with no event for Results; dialogs close abruptly via onClose without a Results surface
- Randomized calc and effects live in UI hooks, making it hard to test deterministically

8) Tabs Hygiene (shadcn)
- Found correct usage in src/components/GameDashboard.tsx:
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  No singleton Tab detected.

Conclusion
- A dedicated, deterministic combat engine + battle state machine are required to prevent stalls.
- Introduce outcomeEmitted + uiLocked + auto transition to Results within 300ms, and an idempotent continue() handler. Results must have exactly one primary CTA.
