import { Targets } from "./lib/strategy/Strategy";
import { StrategyBase } from "./lib/strategy/StrategyBase";
import { LocalSourceProvider } from "./lib/sourceProvider/LocalSourceProvider";
import { GlobalSourceProvider } from "./lib/sourceProvider/GlobalSourceProvider";

const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine;

//const ex = new ExecutionBase(new GlobalIndexStrategy, [12], ["paris"]);
//await ex.launch();
//ex.getResult();

export const strategies = [
    new StrategyBase(
        "Global-Skill",
        "Query the global indexes to find users with the given skills.",
        `SELECT DISTINCT ?user WHERE {
            ?skillIndex a <http://example.org#SkillIndex>;
            <http://example.org#entry> ?user
        } LIMIT 100`, 
        new QueryEngine,
        (t: Targets) => new GlobalSourceProvider().addSkills(t.skills)
    ),
    new StrategyBase(
        "Local-Skill",
        "Query the local indexes to find users with the given skills.",
        `SELECT DISTINCT ?user WHERE {
            ?skillIndex a <http://example.org#SkillIndex>;
            <http://example.org#entry> ?user
        } LIMIT 100`, 
        new QueryEngine,
        (t: Targets) => new LocalSourceProvider(32).addSkills(t.skills)
    ),
]