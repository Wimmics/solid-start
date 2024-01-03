import { Targets } from "./lib/strategy/Strategy";
import { DistributedSourceProvider } from "./lib/sourceProvider/DistributedSourceProvider";
import { CentralizedSourceProvider } from "./lib/sourceProvider/CentralizedSourceProvider";
import { skillQuery, skillTraversalQuery, skillCityQuery, skillCityTraversalQuery } from "./queries";
import StrategyComunica from "./lib/strategy/StrategyComunica";
import StrategyFilter from "./lib/strategy/StrategyFilter";
import { Match } from "./lib/match/Match";

const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine;

const displayCity = (binding: any) => {
    const city = binding.get('city').value;
    return `${city}`;
}

const displayFirstNameLastNameAndCity = (binding: any) => {
    const firstName = binding.get('firstName').value;
    const lastName = binding.get('lastName').value;
    const city = binding.get('city').value;
    return `${firstName} ${lastName} (${city})`;
}

export const strategies = [
    new StrategyComunica(
        "Skill (centralized)",
        "Query the global indexes to find users with the given skills (cities are ignored).",
        skillQuery, 
        new QueryEngine(),
        (t: Targets) => new CentralizedSourceProvider().addSkills(t.skills)
    ),
    new StrategyComunica(
        "Skill (distributed)",
        "Query the local indexes to find users with the given skills (cities are ignored).",
        skillQuery, 
        new QueryEngine(),
        (t: Targets) => new DistributedSourceProvider(32).addSkills(t.skills)
    ),
    new StrategyComunica(
        "Skill with traversal (centralized)",
        "Query the global indexes to find users with the given skills (cities are ignored).",
        skillTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new CentralizedSourceProvider().addSkills(t.skills),
        displayFirstNameLastNameAndCity
    ),
    new StrategyComunica(
        "Skill with traversal (distributed)",
        "Query the local indexes to find users with the given skills (cities are ignored).",
        skillTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new DistributedSourceProvider(32).addSkills(t.skills),
        displayFirstNameLastNameAndCity
    ),
    new StrategyComunica(
        "Skill and city (centralized)",
        "Query the global indexes to find users with the given skills and cities.",
        skillCityQuery, 
        new QueryEngine(),
        (t: Targets) => new CentralizedSourceProvider().addSkills(t.skills).addCities(t.cities)
    ),
    new StrategyComunica(
        "Skill and city (distributed)",
        "Query the local indexes to find users with the given skills and cities.",
        skillCityQuery, 
        new QueryEngine(),
        (t: Targets) => new DistributedSourceProvider(32).addSkills(t.skills).addCities(t.cities)
    ),
    new StrategyComunica(
        "Skill and city with traversal (centralized)",
        "Query the global indexes to find users with the given skills and cities.",
        skillCityTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new CentralizedSourceProvider().addSkills(t.skills).addCities(t.cities),
        displayFirstNameLastNameAndCity
    ),
    new StrategyComunica(
        "Skill and city with traversal (distributed)",
        "Query the local indexes to find users with the given skills and cities.",
        skillCityTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new DistributedSourceProvider(32).addSkills(t.skills).addCities(t.cities),
        displayFirstNameLastNameAndCity
    ),
    new StrategyFilter(
        "Skill with traversal filtered by city (centralized)",
        "This strategy is a two steps strategy: 1) fetch all the users with a certain skill. 2) Filter these users by the queried cities.",
        new StrategyComunica(
            "Skill with traversal (centralized)",
            "Query the global indexes to find users with the given skills (cities are ignored).",
            skillTraversalQuery, 
            new QueryEngineTraversal(),
            (t: Targets) => new CentralizedSourceProvider().addSkills(t.skills),
            displayFirstNameLastNameAndCity
        ),
        (targets: Targets, match: Match) => {
            const matches = match.toString().match(/\((.+)\)/);
            if (!matches || matches.length === 0)
                return false;
            return targets.cities.includes(matches[1]);
        }
    ),
    new StrategyFilter(
        "Skill with traversal filtered by city (distributed)",
        "This strategy is a two steps strategy: 1) fetch all the users with a certain skill. 2) Filter these users by the queried cities.",
        new StrategyComunica(
            "Skill with traversal (distributed)",
            "Query the local indexes to find users with the given skills (cities are ignored).",
            skillTraversalQuery, 
            new QueryEngineTraversal(),
            (t: Targets) => new DistributedSourceProvider(32).addSkills(t.skills),
            displayFirstNameLastNameAndCity
        ),
        (targets: Targets, match: Match) => {
            const matches = match.toString().match(/\((.+)\)/);
            if (!matches || matches.length === 0)
                return false;
            return targets.cities.includes(matches[1]);
        }
    )
]