// src/components/ui/ResourceBar.jsx
// Resource bar showing all player resources with expand on click

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GamePhases } from '../../data/types';
import { calcMilitaryPower } from '../../utils/helpers';
import ResourceBadge from './ResourceBadge';

const ResourceBar = () => {
  const { state } = useGame();
  const [expandedResource, setExpandedResource] = useState(null);

  const militaryPower = calcMilitaryPower(state);
  const isPreState = state.phase === GamePhases.PRE_STATE;

  const handleToggle = (type) => {
    setExpandedResource(prev => prev === type ? null : type);
  };

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {/* Action Points */}
      <ResourceBadge
        type="actionPoints"
        value={state.resources.actionPoints}
        maxValue={state.resources.maxActionPoints}
        expanded={expandedResource === 'actionPoints'}
        onClick={() => handleToggle('actionPoints')}
      />

      {/* Money */}
      <ResourceBadge
        type="money"
        value={state.resources.money}
        expanded={expandedResource === 'money'}
        onClick={() => handleToggle('money')}
      />

      {/* Manpower */}
      <ResourceBadge
        type="manpower"
        value={state.resources.manpower}
        expanded={expandedResource === 'manpower'}
        onClick={() => handleToggle('manpower')}
      />

      {/* Diplomacy Points */}
      <ResourceBadge
        type="diplomacyPoints"
        value={state.resources.diplomacyPoints}
        expanded={expandedResource === 'diplomacyPoints'}
        onClick={() => handleToggle('diplomacyPoints')}
      />

      {/* Tech Points (Post-state only) */}
      {!isPreState && (
        <ResourceBadge
          type="techPoints"
          value={state.resources.techPoints}
          expanded={expandedResource === 'techPoints'}
          onClick={() => handleToggle('techPoints')}
        />
      )}

      {/* Military Power / Underground Strength */}
      <ResourceBadge
        type={isPreState ? 'undergroundStrength' : 'militaryPower'}
        value={militaryPower}
        expanded={expandedResource === 'military'}
        onClick={() => handleToggle('military')}
      />
    </div>
  );
};

export default ResourceBar;
