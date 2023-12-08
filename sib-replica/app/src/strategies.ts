import { Targets } from "./lib/strategy/Strategy";
import { StrategyBase } from "./lib/strategy/StrategyBase";
import { LocalSourceProvider } from "./lib/sourceProvider/LocalSourceProvider";
import { GlobalSourceProvider } from "./lib/sourceProvider/GlobalSourceProvider";

const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine;

const displayFirstNameLastNameAndCity = (binding: any) => {
    const firstName = binding.get('firstName').value;
    const lastName = binding.get('lastName').value;
    const city = binding.get('city').value;
    return `${firstName} ${lastName} (${city})`;
}

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
    new StrategyBase(
        "Global-Skill-Traversal",
        "Query the global indexes to find users with the given skills.",
        `SELECT DISTINCT ?user ?firstName ?lastName ?city WHERE {
            ?skillIndex a <http://example.org#SkillIndex>;
            <http://example.org#entry> ?user.
            ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
            <http://xmlns.com/foaf/0.1/#family_name> ?lastName;
            <http://example.org/#city> ?city.
          } LIMIT 100`, 
        new QueryEngineTraversal,
        (t: Targets) => new GlobalSourceProvider().addSkills(t.skills),
        displayFirstNameLastNameAndCity
    ),
]