import { useEffect, useState } from 'react';
import './App.css';
import { StrategyCard, Mode } from './StrategyCard';
import { Status } from './lib/Status';
import { Strategy } from './lib/strategy/Strategy';
import { strategies } from './strategies';
//import { skillQuery, skillTraversalQuery, skillCityQuery, skillCityTraversalQuery } from './queries';
//const QueryEngine = require('@comunica/query-sparql').QueryEngine;
//const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine;

//const engine = new QueryEngine();
//const engineTraversal = new QueryEngineTraversal();

function App() {

  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState<string>("");
  const [skillInput, setSkillInput] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]); // Result[]

  useEffect(() => {
    console.log(selectedStrategies)
  }, [selectedStrategies])

  /*const update = (results: string[]) => setResults([...results]);

  const getSources = (mode: Mode) => {
    let sources: string[] = []

    skills.forEach(skill => {
      if (mode === 'local') {
        for (let i = 1; i <= 32; i++) { 
          sources.push(`http://localhost:${8000 + i}/indexes/skill/${skill}`)
        }
      }
      else sources.push("http://localhost:8000/org/indexes/skill/" + skill)
    });

    cities.forEach(city => {
      if (mode === 'local') {
        for (let i = 1; i <= 32; i++) { 
          sources.push(`http://localhost:${8000 + i}/indexes/city/${city}`)
        }
      }
      else 
      sources.push("http://localhost:8000/org/indexes/city/" + city)
    });

    return sources;
  }

  const query = async (mode: Mode) => {
    setResults([]);

    const query = cities.length === 0? skillQuery: skillCityQuery;

    const bindingsStream = await engine.queryBindings(query, {
      lenient: true,
      sources: getSources(mode),
    });

    let r: string[] = [];

    // Consume results as a stream (best performance)
    bindingsStream.on('data', (binding: any) => {
      r.push(binding.get('user').value);
      update(r);
    });
  };

  const queryTraversal = async (mode: Mode) => {
    setResults([]);

    const query = cities.length === 0? skillTraversalQuery: skillCityTraversalQuery;

    console.log("Start querty traversal")
    const bindingsStream = await engineTraversal.queryBindings(query, {
      lenient: true,
      sources: getSources(mode),
    });

    let r: string[] = [];

    // Consume results as a stream (best performance)
    bindingsStream.on('data', (binding: any) => {
      const firstName = binding.get('firstName').value;
      const lastName = binding.get('lastName').value;
      const city = binding.get('city').value;
      console.log(`Get result: ${firstName} ${lastName} (${city})`);
      r.push(`${firstName} ${lastName} (${city})`);
      update(r);
    });

    bindingsStream.on('end', () => console.log("Terminated query traversal"));
  };*/

  const addSkill = () => {
    setSelectedSkills([...selectedSkills, skillInput]);
    setSkillInput("");
  }

  const addCity = () => {
    setSelectedCities([...selectedCities, cityInput]);
    setCityInput("");
  }

  const handleStrategy = (s: Strategy, checked: boolean) => {
    if (checked)
      setSelectedStrategies([...selectedStrategies, s.getName()])
    else setSelectedStrategies(selectedStrategies.filter(ts => ts != s.getName()))
  }

  const handleLaunch = () => {
    selectedStrategies.forEach(async (name) => {
      const strategy = strategies.find(s => s.getName() === name);

      if (strategy) {
        await strategy.execute({skills: selectedSkills, cities: selectedCities});
        setResults(strategy.getResult().getMatches().map(m => m.toString()));
      }
    })
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

      <p>Current skills: {selectedSkills.map(skill => skill + ', ')}</p>
      <p>Current cities: {selectedCities.map(city => city + ', ')}</p>

      <h3>2. Select indexing stretegies</h3>
      <p>Select the strategies you want to compare.</p>

{/*
      <p><button onClick={() => query('global')}>Query federated indexes</button></p>
      <p><button onClick={() => queryTraversal('global')}>Query federated indexes with traversal</button></p>
      <p><button onClick={() => query('local')}>Query local indexes</button></p>
      <p><button onClick={() => queryTraversal('local')}>Query local indexes with traversal</button></p>
*/}
      {strategies.map((s: Strategy) => 
        <StrategyCard 
          name={s.getName()} 
          description={s.getDescription()} 
          sparqlQuery={s.getSparqlQuery()}
          onChanged={(checked: boolean) => handleStrategy(s, checked)}
        />
      )}

      <p>
        <button onClick={handleLaunch}>Launch!</button>
      </p>

      <h3>3. Get results</h3>
      <ol>
        {results.map((r: string, i: number) => <li key={i}>{r}</li>)}
      </ol>
    </div>
  );
}

export default App;
