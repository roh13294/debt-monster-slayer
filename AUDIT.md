# AUDIT.md

Repo Audit — debt-monster-slayer (Slayr)

1) Framework & Build
- Framework: Vite (vite ^5.4.1) + React 18.3.1
- TypeScript: Yes (tsconfig.json present, typescript ^5.5.3)
- Routing: react-router-dom ^6.26.2 (client-side)
- State/Services: Custom React contexts/hooks; Supabase client present (no server routes)

2) Styling & UI Library
- Tailwind CSS ^3.4.11 with tailwindcss-animate, custom design tokens via CSS variables (HSL)
- shadcn/ui components under src/components/ui/* (Radix primitives)
- lucide-react icons
- Framer Motion for animations (battle effects, mission results)

3) Path Aliases & Config
- tsconfig.json: baseUrl=., paths { "@/*": "./src/*" }
- vite.config.ts: resolve.alias { "@": path.resolve('./src') }
- Alias hygiene: OK (matches both TS + Vite)

4) Tailwind Config
- tailwind.config.ts (primary) with extended theme (colors, shadows, animations)
- tailwind.config.js also present (legacy/duplicate). Both include ./src/**/*.{ts,tsx}. No conflicts observed at runtime, but ts version should be the one used by PostCSS in Vite.

5) App Structure (high level)
- Pages: src/pages/{Auth.tsx, Index.tsx, NotFound.tsx}
- Entry: src/main.tsx, src/App.tsx
- Contexts: src/context/{GameProvider.tsx, GameContext.tsx, GameInitialization.tsx, AuthContext.tsx}
- Battle System (rich):
  - Arena: components/battle/{BattleArena.tsx, BattleArenaEnhanced.tsx}
  - Controls & HUD: BattleAttackControls.tsx, BattleHUD.tsx, BattleHeader.tsx, BattleLog.tsx, etc.
  - Flow screens: BattlePrepStage.tsx, BattleLootStage.tsx, RaidResultsScreen.tsx, TacticalRaidScreen.tsx
  - Effects/Events: BattleEffects.css, BattleEvents.tsx, BattleTips.tsx
  - Support hooks: useBattleState.ts, useBattleActions.ts
- Narrative/Cutscenes: components/cutscene/CutsceneEventScreen.tsx, components/journey/{NarrativeMoment.tsx, JourneyTimeline.tsx}
- Quests/Skills/Relics scaffolding:
  - Quests: components/quests/QuestSystem.tsx
  - Skills: components/skills/{SkillTree.tsx, BreathingStyleTree.tsx, BreathingSkillsPanel.tsx}
  - Power-ups: components/PowerUpShop.tsx, data/powerUpsData.ts
- Economy/Temple: components/temple/{WealthTempleScreen.tsx, WealthTempleInterface.tsx}
- Dashboard & Summary: components/{Dashboard.tsx, GameDashboard.tsx, StatsDashboard.tsx}, summary/{MonthSummary.tsx, MonthlySummaryEnhanced.tsx}
- Monsters & Data: utils/{monsterImages.ts, monsterProfiles.ts}, data/monsterTemplates.ts
- Customization: components/customization/AvatarCustomizer.tsx

6) Existing Game Modules vs Plan
- Home/Dashboard: Yes (Index.tsx + GameDashboard)
- Battle: Yes (BattleArena, BattleArenaEnhanced)
- Results: Partial (MissionResults.tsx, RaidResultsScreen.tsx, VictoryScreen.tsx, BattleLootStage.tsx)
- Loadout: Partial (PowerUps, Customization); no dedicated Relics/Skills loadout page yet
- Skill Tree: Present (BreathingStyleTree/SkillTree)
- Relics: Not a separate surfaced system yet (no Relics data file)
- Episodes: Not present (no episodes service or JSON)

7) Known Dev Console Errors (current session)
- None observed via logs tool at audit time.

8) Import & Tabs Hygiene Check
- Search for "@/components/ui/tabs": Found in src/components/GameDashboard.tsx
- Usage: import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" (correct shadcn family; no singular Tab usage detected)
- No failing imports detected in search.

9) Supabase / Backend
- Supabase client exists (src/integrations/supabase/client.ts). No API routes (Vite app). All gameplay is client-side; suitable for a local service layer approach for battle endpoints (to mimic server contracts) per plan.

10) Immediate Risks & Gaps
- Battle end flow: Multiple results components exist but a single, deterministic outcome router/state machine is not implemented; risk of “stuck in battle” states.
- Duplicate Tailwind configs (ts + js). Prefer tailwind.config.ts; consider removing js file to reduce confusion.
- No unified game types for Skills/Relics/Episodes as requested in plan; current types are oriented around debts and budgeting.

11) Recommendations (Next Steps per Implementation Plan)
- Add src/types/game.ts (Element/Stats/Skill/Relic/Player/etc.) and keep it additive alongside existing types.
- Create pure combat engine and balance config under src/modules/combat (deterministic; unit-tested).
- Introduce battle state machine with outcomeEmitted guard; lock ActionPanel on resolve; auto-route to Results within 300ms.
- Build Results screen with one primary Continue CTA; wire idempotent continue handler via local client service (since Vite).
- Seed content: demons.json, skills.json, relics.json, episodes.json under src/data.
- Tests: Vitest unit + component; basic Playwright E2E for win path.

Audit completed: This reflects the repository at the time of audit and is prerequisite to implementation steps.
