import { Targets } from "./lib/strategy/Strategy";
import { StrategyBase } from "./lib/strategy/StrategyBase";
import { LocalSourceProvider } from "./lib/sourceProvider/LocalSourceProvider";
import { GlobalSourceProvider } from "./lib/sourceProvider/GlobalSourceProvider";
import { skillQuery, skillTraversalQuery, skillCityQuery, skillCityTraversalQuery } from "./queries";

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
        "Query the global indexes to find users with the given skills (cities are ignored).",
        skillQuery, 
        new QueryEngine(),
        (t: Targets) => new GlobalSourceProvider().addSkills(t.skills)
    ),
    new StrategyBase(
        "Local-Skill",
        "Query the local indexes to find users with the given skills (cities are ignored).",
        skillQuery, 
        new QueryEngine(),
        (t: Targets) => new LocalSourceProvider(32).addSkills(t.skills)
    ),
    new StrategyBase(
        "Global-Skill-Traversal",
        "Query the global indexes to find users with the given skills (cities are ignored).",
        skillTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new GlobalSourceProvider().addSkills(t.skills),
        displayFirstNameLastNameAndCity
    ),
    new StrategyBase(
        "Local-Skill-Traversal",
        "Query the local indexes to find users with the given skills (cities are ignored).",
        skillTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new LocalSourceProvider(32).addSkills(t.skills),
        displayFirstNameLastNameAndCity
    ),
    new StrategyBase(
        "Global-Skill-City",
        "Query the global indexes to find users with the given skills and cities.",
        skillCityQuery, 
        new QueryEngine(),
        (t: Targets) => new GlobalSourceProvider().addSkills(t.skills).addCities(t.cities)
    ),
    new StrategyBase(
        "Local-Skill-City",
        "Query the local indexes to find users with the given skills and cities.",
        skillCityQuery, 
        new QueryEngine(),
        (t: Targets) => new LocalSourceProvider(32).addSkills(t.skills).addCities(t.cities)
    ),
    new StrategyBase(
        "Global-Skill-City-Traversal",
        "Query the global indexes to find users with the given skills and cities.",
        skillCityTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new GlobalSourceProvider().addSkills(t.skills).addCities(t.cities),
        displayFirstNameLastNameAndCity
    ),
    new StrategyBase(
        "Local-Skill-City-Traversal",
        "Query the local indexes to find users with the given skills and cities.",
        skillCityTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new LocalSourceProvider(32).addSkills(t.skills).addCities(t.cities),
        displayFirstNameLastNameAndCity
    ),
]