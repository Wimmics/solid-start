import './App.css';
import { useState } from 'react';
import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid';

const query = async (update: (result: string[]) => void) => {
  let localResult: Array<string> = [];
  const engine = new QueryEngine();
  
  console.log("Query started");

  const bindingStream = await engine.queryBindings(`
  SELECT DISTINCT ?user WHERE { ?user a foaf:user. ?user <http://happy-dev.fr/owl/#skills> ?skills. ?skills <http://www.w3.org/ns/ldp#contains> <https://api.test3.startinblox.com/skills/8/> }`, {
    // Sources field is optional. Will be derived from query if not provided.
    sources: ['https://api.test3.startinblox.com/users/', 'https://api.test1.startinblox.com/users/'], // Sets your profile as query source
    //'@comunica/actor-http-inrupt-solid-client-authn:session': session,
    lenient: true,
  });

  bindingStream.on('data', (value: string) => {
    const user = JSON.parse(value);
    localResult.push(user.user);
    update(localResult);
  });
  
  bindingStream.on('end', () => {
    console.log("Query terminated");
  });
}

// https://github.com/diegomura/react-pdf/issues/1645#issuecomment-1444995159
function App() {

  const [results, setResults] = useState<Array<string>>([]);
  
  return (
    <div>
      <button onClick={() => query((results: string[]) => setResults([...results]))}>Launch query</button>
      <ol>
        {results.map((result: string, index: number) => (<li key={'result' + index}>{result}</li>))}
      </ol>
    </div>
  );
}

export default App;
