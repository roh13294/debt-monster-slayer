import React from 'react';
import { useBattleStore } from '../state/battleStore';

interface ActionPanelProps {
  children: React.ReactNode;
}

export function ActionPanel({ children }: ActionPanelProps) {
  const { uiLocked, phase } = useBattleStore();
  const disabled = uiLocked || phase === 'RESOLVE' || phase === 'RESULTS' || phase === 'OUTCOME_EMITTED';
  return (
    <div aria-disabled={disabled} className={disabled ? 'pointer-events-none opacity-60' : ''}>
      {children}
    </div>
  );
}

export default ActionPanel;
