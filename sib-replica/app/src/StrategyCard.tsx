import { useEffect, useState } from 'react';
import { Accordion } from './Accordion';
import { Strategy, Targets } from './lib/strategy/Strategy';

export type Mode = 'local' | 'global';

export function StrategyCard(props: {strategy: Strategy, targets: Targets, onChanged?: (checked: boolean) => void}) {

  const { strategy, targets, onChanged } = props;

  const [checked, setChecked] = useState<boolean>(false);

  const id = `strat-${strategy.getName()}`;

  const handleChecked = () => {
    const newState = !checked;
    setChecked(newState);
    if (onChanged)
      onChanged(newState);
  }

  return (
    <div>
        <input 
            id={id} 
            type="checkbox" 
            checked={checked} 
            onChange={handleChecked} 
        /> 
        <label 
            htmlFor={id}
            style={{cursor: "pointer"}}
        >
            {strategy.getName()} <br /> <i>{strategy.getDescription()}</i>
        </label>
        
        <Accordion 
          title="See/hide SPARQL query"
          content={<pre>{strategy.getSparqlQuery()}</pre>}
        />

        <Accordion 
          title={`See/hide targeted sources (${strategy.getTargetedSources(targets).length})`}
          content={
            <pre>
              {strategy.getTargetedSources(targets).map((source: string) => `${source}\n`)}
            </pre>
          }
        />
    </div>
  )
}