import { useEffect, useState } from 'react';

export type Mode = 'local' | 'global';

export function Strategy(props: {name: string, description: string}) {

  const { name, description } = props;

  const [checked, setChecked] = useState<boolean>(false);

  const id = `strat-${name}`;

  return (
    <div>
        <input 
            id={id} 
            type="checkbox" 
            checked={checked} 
            onClick={() => setChecked(!checked)} 
        /> 
        <label 
            htmlFor={id}
            style={{cursor: "pointer"}}
        >
            {description}
        </label>
    </div>
  )
}