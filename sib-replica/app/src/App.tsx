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

  const skillQuery = `SELECT DISTINCT ?user WHERE {
    ?index a <http://example.org#SkillIndex>;
    <http://example.org#entry> ?user
  } LIMIT 100`;

  const skillCityQuery = `SELECT DISTINCT ?user WHERE {
    ?skillIndex a <http://example.org#SkillIndex>;
    <http://example.org#entry> ?user.
    ?cityIndex a <http://example.org#CityIndex>;
    <http://example.org#entry> ?user.
  } LIMIT 100`;

  const skillTraversalQuery = `SELECT DISTINCT ?user ?firstName ?lastName ?city WHERE {
    ?index a <http://example.org#SkillIndex>;
    <http://example.org#entry> ?user.
    ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
    <http://xmlns.com/foaf/0.1/#family_name> ?lastName;
    <http://example.org/#city> ?city.
  } LIMIT 100`;

  const skillCityTraversalQuery = `SELECT DISTINCT ?user ?firstName ?lastName ?city WHERE {
    ?skillIndex a <http://example.org#SkillIndex>;
    <http://example.org#entry> ?user.
    ?cityIndex a <http://example.org#CityIndex>;
    <http://example.org#entry> ?user.
    ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
    <http://xmlns.com/foaf/0.1/#family_name> ?lastName;
    <http://example.org/#city> ?city.
  } LIMIT 100`;

  const getSources = () => {
    let sources: string[] = []
    skills.forEach(skill => {
      sources.push("http://localhost:8000/org/indexes/skill/" + skill)
    });
    cities.forEach(city => {
      sources.push("http://localhost:8000/org/indexes/city/" + city)
    });
    return sources;
  }

  const query = async (update: (result: string[]) => void) => {
    setResults([]);

    const query = cities.length === 0? skillQuery: skillCityQuery;

    const bindingsStream = await engine.queryBindings(query, {
      sources: getSources(),
    });

    let r: string[] = [];

    // Consume results as a stream (best performance)
    bindingsStream.on('data', (binding: any) => {
      r.push(binding.get('user').value);
      update(r);
    });
  };

  const queryTraversal = async (update: (result: string[]) => void) => {
    setResults([]);

    const query = cities.length === 0? skillTraversalQuery: skillCityTraversalQuery;

    console.log("Start querty traversal")
    const bindingsStream = await engineTraversal.queryBindings(query, {
      sources: getSources(),
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

    bindingsStream.on('data', () => console.log("Terminated query traversal"));
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
