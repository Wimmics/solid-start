import { useEffect, useState } from 'react';
import './App.css';
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine;

const engine = new QueryEngine();
const engineTraversal = new QueryEngineTraversal();

function App() {

  const [input, setInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);

  const query = async (update: (result: string[]) => void) => {
    setResults([]);

    let sources: string[] = []
    skills.forEach(skill => {
      sources.push("http://localhost:8000/org/index/index" + skill)
    });

    const bindingsStream = await engine.queryBindings(`
      SELECT DISTINCT ?user WHERE {
        ?s a <http://example.org#Index>;
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

  const queryTraversal = async (update: (result: string[]) => void) => {
    setResults([]);

    let sources: string[] = []
    skills.forEach(skill => {
      sources.push("http://localhost:8000/org/index/index" + skill)
    });

    const bindingsStream = await engineTraversal.queryBindings(`
      SELECT DISTINCT ?user ?firstName ?lastName WHERE {
        ?s a <http://example.org#Index>;
        <http://example.org#entry> ?user.
        ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
        <http://xmlns.com/foaf/0.1/#family_name> ?lastName
      } LIMIT 100`, {
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
    setSkills([...skills, input]);
    setInput("");
  }

  return (
    <div className="App">
      <input 
        type="text" 
        placeholder="Enter a skill <= 600"
        value={input}
        onChange={(e) => setInput(e.target.value)} 
      />
      <button onClick={() => addSkill()}>Add to query</button>

      <p><strong>Queried skills:</strong> {skills.map(skill => skill + ', ')}</p>

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
