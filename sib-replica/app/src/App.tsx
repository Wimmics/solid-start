import { useEffect, useState } from 'react';
import './App.css';
import { Strategy, Mode } from './Strategy';
import { skillQuery, skillTraversalQuery, skillCityQuery, skillCityTraversalQuery } from './queries';
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine;

const engine = new QueryEngine();
const engineTraversal = new QueryEngineTraversal();

function App() {

  const [strategy, setStrategy] = useState<string>("");
  const [cityInput, setCityInput] = useState<string>("");
  const [skillInput, setSkillInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]); // Result[]

  const strategies = [
    {name: "Query federated indexes", description: "Query federated indexes with traversal"},

  ]

  const update = (results: string[]) => setResults([...results]);

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
  };

  const addSkill = () => {
    setSkills([...skills, skillInput]);
    setSkillInput("");
  }

  const addCity = () => {
    setCities([...cities, cityInput]);
    setCityInput("");
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

      <p>Current skills: {skills.map(skill => skill + ', ')}</p>
      <p>Current cities: {cities.map(city => city + ', ')}</p>

      <h3>2. Choose an indexing strategy</h3>
      <p>Current strategy: </p>

      <p><button onClick={() => query('global')}>Query federated indexes</button></p>
      <p><button onClick={() => queryTraversal('global')}>Query federated indexes with traversal</button></p>
      <p><button onClick={() => query('local')}>Query local indexes</button></p>
      <p><button onClick={() => queryTraversal('local')}>Query local indexes with traversal</button></p>

      <Strategy name="Query federated indexes" description="desc" />
      <Strategy name="Query 2" description="desc 2" />

      <h3>3. Get results</h3>
      <ol>
        {results.map((r: string, i: number) => <li key={i}>{r}</li>)}
      </ol>
    </div>
  );
}

export default App;
