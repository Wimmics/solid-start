import { useEffect, useState } from 'react';
import './App.css';
const QueryEngine = require('@comunica/query-sparql').QueryEngine;

const engine = new QueryEngine();

function App() {

  const [input, setInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);

  const query = async (update: (result: string[]) => void) => {
    setResults([]);

    let sources: string[] = []
    skills.forEach(skill => {
      sources.push("http://localhost:8000/app/index/index" + skill)
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
      //console.log(binding.get('user').value);
      //console.log(binding.get('s').termType);
      //console.log(binding.get('p').value);
      //console.log(binding.get('o').value);
    });
    //setResults(r);
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
      <button onClick={() => query((results: string[]) => setResults([...results]))}>Refresh</button>
      <ol>
        {results.map((r: string, i: number) => <li key={i}>{r}</li>)}
      </ol>
    </div>
  );
}

export default App;
