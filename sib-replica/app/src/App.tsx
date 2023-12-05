import { useEffect, useState } from 'react';
import './App.css';
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine;

const engine = new QueryEngine();
const engineTraversal = new QueryEngineTraversal();

function App() {

  const [cityInput, setCityInput] = useState<string>("");
  const [skillInput, setSkillInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);

  const query = async (update: (result: string[]) => void) => {
    setResults([]);

    let sources: string[] = []
    skills.forEach(skill => {
      sources.push("http://localhost:8000/org/indexes/skill/" + skill)
    });

    const bindingsStream = await engine.queryBindings(`
      SELECT DISTINCT ?user WHERE {
        ?index a <http://example.org#SkillIndex>;
        <http://example.org#entry> ?user
      } LIMIT 100`, {
      sources: sources,
    });

    let r: string[] = [];

    // Consume results as a stream (best performance)
    bindingsStream.on('data', (binding: any) => {
      r.push(binding.get('user').value);
      update(r);
    });
  };

  const skillTraversalQuery = `SELECT DISTINCT ?user ?firstName ?lastName WHERE {
    ?index a <http://example.org#SkillIndex>;
    <http://example.org#entry> ?user.
    ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
    <http://xmlns.com/foaf/0.1/#family_name> ?lastName
  } LIMIT 100`;

  const skillCityTraversalQuery = `SELECT DISTINCT ?user ?firstName ?lastName WHERE {
    ?skillIndex a <http://example.org#SkillIndex>;
    <http://example.org#entry> ?user.
    ?cityIndex a <http://example.org#CityIndex>;
    <http://example.org#entry> ?user.
    ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
    <http://xmlns.com/foaf/0.1/#family_name> ?lastName
  } LIMIT 100`;

  const queryTraversal = async (update: (result: string[]) => void) => {
    setResults([]);

    let sources: string[] = []
    skills.forEach(skill => {
      sources.push("http://localhost:8000/org/indexes/skill/" + skill)
    });

    sources.push("http://localhost:8000/org/indexes/city/paris")

    const query = skillCityTraversalQuery; //skillTraversalQuery;

    const bindingsStream = await engineTraversal.queryBindings(query, {
      sources: sources,
    });

    let r: string[] = [];

    // Consume results as a stream (best performance)
    bindingsStream.on('data', (binding: any) => {
      r.push(binding.get('firstName').value + ' ' + binding.get('lastName').value );
      update(r);
    });
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
    <div className="App">
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

      <p><strong>Queried skills:</strong> {skills.map(skill => skill + ', ')}</p>
      <p><strong>Queried cities:</strong> {cities.map(city => city + ', ')}</p>

      <h3>Results</h3>
      <button onClick={() => query((results: string[]) => setResults([...results]))}>Query</button>
      <button onClick={() => queryTraversal((results: string[]) => setResults([...results]))}>Query traversal</button>
      <ol>
        {results.map((r: string, i: number) => <li key={i}>{r}</li>)}
      </ol>
    </div>
  );
}

export default App;
