import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useBattleStore } from '../state/battleStore';

export function ResultsScreen() {
  const navigate = useNavigate();
  const { outcome, rewards, continue: cont, resetBattle } = useBattleStore();
  if (!outcome) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">Result: {outcome.outcome.toUpperCase()}</h2>
        {rewards && (
          <div className="text-sm text-foreground/80">
            <div>XP: {rewards.xp}</div>
            <div>Gold: {rewards.gold}</div>
            {rewards.shards ? <div>Shards: {rewards.shards}</div> : null}
          </div>
        )}
        <Button className="w-full" onClick={() => { const next = cont(); resetBattle(); navigate(next); }}>
          Continue
        </Button>
      </Card>
    </div>
  );
}

export default ResultsScreen;
