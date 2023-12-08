import { useEffect, useState } from 'react';

export type Mode = 'local' | 'global';

export function StrategyCard(props: {name: string, description: string, sparqlQuery: string, onChanged?: (checked: boolean) => void}) {

  const { name, description, sparqlQuery, onChanged } = props;

  const [checked, setChecked] = useState<boolean>(false);

  const id = `strat-${name}`;

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
            {name} - {description}
        </label>
        <pre>{sparqlQuery}</pre>

        <p>See targeted sources</p>
    </div>
  )
}