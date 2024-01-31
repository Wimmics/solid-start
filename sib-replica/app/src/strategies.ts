import { Targets } from "./lib/strategy/Strategy";
import { DistributedSourceProvider } from "./lib/sourceProvider/DistributedSourceProvider";
import { FederatedSourceProvider } from "./lib/sourceProvider/FederatedSourceProvider";
import { skillQuery, skillTraversalQuery, skillCityQuery, skillCityTraversalQuery, cityTraversalQuery, skillRootTraversalQuery, skillRootNamedGraphTraversalQuery } from "./queries";
import StrategyComunica from "./lib/strategy/StrategyComunica";
import StrategyFilter from "./lib/strategy/StrategyFilter";
import { Match } from "./lib/match/Match";
import { SourceProviderBase } from "./lib/sourceProvider/SourceProviderBase";

const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine;

export const strategies = [
    new StrategyComunica(
        "Skill (federated)",
        "Query the global indexes to find users with the given skills (cities are ignored).",
        skillQuery, 
        new QueryEngine(),
        (t: Targets) => new FederatedSourceProvider().addSkills(t.skills)
    ),
    new StrategyComunica(
        "Skill (distributed)",
        "Query the local indexes to find users with the given skills (cities are ignored).",
        skillQuery, 
        new QueryEngine(),
        (t: Targets) => new DistributedSourceProvider(32).addSkills(t.skills)
    ),
    new StrategyComunica(
        "Skill with traversal (federated)",
        "Query the global indexes to find users with the given skills (cities are ignored).",
        skillTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new FederatedSourceProvider().addSkills(t.skills),
    ),
    new StrategyComunica(
        "Skill with traversal (distributed)",
        "Query the local indexes to find users with the given skills (cities are ignored).",
        skillTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new DistributedSourceProvider(32).addSkills(t.skills),
    ),
    new StrategyComunica(
        "City with traversal (federated)",
        "Query the global indexes to find users with the given city (skills are ignored).",
        cityTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new FederatedSourceProvider().addCities(t.cities),
    ),
    new StrategyComunica(
        "City with traversal (distributed)",
        "Query the local indexes to find users with the given city (skills are ignored).",
        cityTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new DistributedSourceProvider(32).addCities(t.cities),
    ),
    new StrategyComunica(
        "Skill and city (federated)",
        "Query the global indexes to find users with the given skills and cities.",
        skillCityQuery, 
        new QueryEngine(),
        (t: Targets) => new FederatedSourceProvider().addSkills(t.skills).addCities(t.cities)
    ),
    new StrategyComunica(
        "Skill and city (distributed)",
        "Query the local indexes to find users with the given skills and cities.",
        skillCityQuery, 
        new QueryEngine(),
        (t: Targets) => new DistributedSourceProvider(32).addSkills(t.skills).addCities(t.cities)
    ),
    new StrategyComunica(
        "Skill and city with traversal (federated)",
        "Query the global indexes to find users with the given skills and cities.",
        skillCityTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new FederatedSourceProvider().addSkills(t.skills).addCities(t.cities),
    ),
    new StrategyComunica(
        "Skill and city with traversal (distributed)",
        "Query the local indexes to find users with the given skills and cities.",
        skillCityTraversalQuery, 
        new QueryEngineTraversal(),
        (t: Targets) => new DistributedSourceProvider(32).addSkills(t.skills).addCities(t.cities),
    ),
    new StrategyFilter(
        "Skill with traversal filtered by city (federated)",
        "This strategy is a two steps strategy: 1) fetch all the users with a certain skill. 2) Filter these users by the queried cities.",
        new StrategyComunica(
            "Skill with traversal (federated)",
            "Query the global indexes to find users with the given skills (cities are ignored).",
            skillTraversalQuery, 
            new QueryEngineTraversal(),
            (t: Targets) => new FederatedSourceProvider().addSkills(t.skills),
        ),
        (targets: Targets, match: Match) => targets.cities.includes(match.getUser().getCity())
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
        ),
        (targets: Targets, match: Match) => targets.cities.includes(match.getUser().getCity())
    ),
    new StrategyFilter(
        "City with traversal filtered by skill (federated)",
        "This strategy is a two steps strategy: 1) fetch all the users with a certain city. 2) Filter these users by the queried skills.",
        new StrategyComunica(
            "City with traversal (federated)",
            "Query the global indexes to find users with the given city (skills are ignored).",
            cityTraversalQuery, 
            new QueryEngineTraversal(),
            (t: Targets) => new FederatedSourceProvider().addCities(t.cities),
        ),
        (targets: Targets, match: Match) => match.getUser().getSkills().some((skill: string) =>  targets.skills.includes(skill))
    ),
    new StrategyFilter(
        "City with traversal filtered by skill (distributed)",
        "This strategy is a two steps strategy: 1) fetch all the users with a certain city. 2) Filter these users by the queried skills.",
        new StrategyComunica(
            "City with traversal (distributed)",
            "Query the local indexes to find users with the given city (skills are ignored).",
            cityTraversalQuery, 
            new QueryEngineTraversal(),
            (t: Targets) => new DistributedSourceProvider(32).addCities(t.cities),
        ),
        (targets: Targets, match: Match) => match.getUser().getSkills().some((skill: string) =>  targets.skills.includes(skill))
    ),
    new StrategyComunica(
        "Skill with traversal and index discovey (federated) - hard coded skill",
        "Discover indexes to find users with the given skills (cities are ignored).",
        skillRootTraversalQuery('12'), 
        new QueryEngineTraversal(),
        (t: Targets) => new SourceProviderBase().addSource("http://localhost:8000/org/indexes/root"),
    ),
    new StrategyComunica(
        "Skill with named graph traversal and index discovey (federated) - hard coded skill",
        "Discover indexes to find users with the given skills (cities are ignored).",
        skillRootNamedGraphTraversalQuery('12'), 
        new QueryEngineTraversal(),
        (t: Targets) => new SourceProviderBase().addSource("http://localhost:8000/org/indexes/root"),
    ),
]