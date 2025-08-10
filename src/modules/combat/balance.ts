export const BalanceConfig = {
  baseCritMult: 1.5,
  guardReduction: 0.4,
  fleeBaseChance: 0.35,
  elementMatrix: {
    fire:  { ice: 1.25, storm: 0.9 },
    ice:   { storm: 1.25, fire: 0.9 },
    storm: { shadow: 1.15, radiant: 0.9 },
    shadow:{ radiant: 1.2 },
    radiant:{ shadow: 1.2 },
  } as Record<string, Record<string, number>>,
  xpCurve: (level: number) => Math.floor(50 + level * 35),
  rngSeedBase: 777,
};

export function getElementMatrixMultiplier(attacker: string, defender: string): number {
  const a = BalanceConfig.elementMatrix[attacker];
  if (!a) return 1.0;
  return a[defender] ?? 1.0;
}
