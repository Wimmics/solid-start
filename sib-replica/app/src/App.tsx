import { useEffect, useState } from 'react';
import './App.css';
import { StrategyCard } from './StrategyCard';
import { StrategyResult } from './StrategyResult';
import { Strategy, Targets } from './lib/strategy/Strategy';
import { strategies } from './strategies';
import { Execution } from './lib/execution/Execution';
import { SequentialExecution } from './lib/execution/SequentialExecution';

function App() {

  const [execution, setExecution] = useState<Execution>(new SequentialExecution([]));
  const [targets, setTargets] = useState<Targets>({skills: [], cities: []});
  const [cityInput, setCityInput] = useState<string>("");
  const [skillInput, setSkillInput] = useState<string>("");

  const addSkill = () => {
    setTargets({skills: [...targets.skills, skillInput], cities: targets.cities});
    setSkillInput("");
  }

  const addCity = () => {
    setTargets({skills: targets.skills, cities: [...targets.cities, cityInput]});
    setCityInput("");
  }

  const handleStrategy = (strategy: Strategy, checked: boolean) => {
    let strategies = [];

    if (checked)
      strategies = [...execution.getStrategies(), strategy]
    else strategies = execution.getStrategies().filter(s => s != strategy);

    setExecution(new SequentialExecution(strategies));
  }

  const handleLaunch = async () => {
    execution.run(targets);
  }

  return (
    <div className="App" style={{ padding: 10 }}>
      <h3>1. Make the query</h3>

      <p>
        <input 
          type="text" 
          placeholder="Enter a skill <= 600"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)} 
        />
        <button onClick={() => addSkill()}>Add to query</button>
      </p>

      <p>
        <input 
          type="text" 
          placeholder="Enter a city"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)} 
        />
        <button onClick={() => addCity()}>Add to query</button>
      </p>

      <p>
        Select only instances: ...
      </p>

      <p>Current skills: {targets.skills.map(skill => skill + ', ')}</p>
      <p>Current cities: {targets.cities.map(city => city + ', ')}</p>

      <h3>2. Select indexing strategies</h3>
      <p>Select the strategies you want to compare for the query.</p>

      {strategies.map((s: Strategy) => 
        <StrategyCard 
          name={s.getName()} 
          description={s.getDescription()} 
          sparqlQuery={s.getSparqlQuery()}
          onChanged={(checked: boolean) => handleStrategy(s, checked)}
          key={s.getName()}
        />
      )}

      <p>
        <button onClick={handleLaunch}>Launch!</button>
      </p>

      <h3>3. Get results</h3>
      
      <p>Time ellapsed: </p>

      {execution.getStrategies().map((s: Strategy) => <StrategyResult strategy={s} />)}
    </div>
  );
}

export default App;
