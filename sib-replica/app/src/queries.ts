import { Targets } from "./lib/strategy/Strategy";

export const skillQuery = `SELECT DISTINCT ?user WHERE {
    ?skillIndex a <http://example.org#SkillIndex>;
    <http://example.org#entry> ?user
  }`; // LIMIT 100`;

export const cityQuery = `SELECT DISTINCT ?user WHERE {
  ?cityIndex a <http://example.org#CityIndex>;
  <http://example.org#entry> ?user
}`; // LIMIT 100`;

export const skillCityQuery = `SELECT DISTINCT ?user WHERE {
    ?skillIndex a <http://example.org#SkillIndex>;
    <http://example.org#entry> ?user.
    ?cityIndex a <http://example.org#CityIndex>;
    <http://example.org#entry> ?user.
  } LIMIT 100`;

export const skillTraversalQuery = `SELECT DISTINCT ?user ?firstName ?lastName ?city ?skills WHERE {
    ?skillIndex a <http://example.org#SkillIndex>;
    <http://example.org#entry> ?user.
    ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
    <http://xmlns.com/foaf/0.1/#family_name> ?lastName;
    <http://example.org/#city> ?city;
    <http://example.org/#skills> ?skills.
  } LIMIT 100`;

export const skillRootTraversalQuery = (skill: string) => `SELECT DISTINCT ?user ?firstName ?lastName ?city ?skills WHERE {
  ?registration a <http://example.org#PropertyIndexRegistration>;
  <http://example.org#forProperty> <http://example.org#forProperty>;
  <http://example.org#forValue> <http://example.org#hasSkill>;
  <http://example.org#instancesIn> ?skillRootIndex.

  ?skillRegistration a <http://example.org#PropertyIndexRegistration>;
  <http://example.org#inIndex> ?skillRootIndex;
  <http://example.org#forProperty> <http://example.org#hasSkill>;
  <http://example.org#forValue> "${skill}";
  <http://www.w3.org/2000/01/rdf-schema#seeAlso> ?skillIndex.

  ?skillIndex a <http://example.org#Index>;  
  <http://example.org#entry> ?user.

  ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
  <http://xmlns.com/foaf/0.1/#family_name> ?lastName;
  <http://example.org/#city> ?city;
  <http://example.org/#skills> ?skills.
} LIMIT 100`;

export const skillRootNamedGraphTraversalQuery = (skill: string) => `SELECT DISTINCT ?user ?firstName ?lastName ?city ?skills WHERE {
  [] <http://example.org#forProperty> <http://example.org#forProperty> ;
    <http://example.org#forValue> <http://example.org#hasSkill> ;
    <http://example.org#instancesIn> ?skillIndex.

  GRAPH ?skillIndex {
    ?entry <http://example.org#forProperty> <http://example.org#hasSkill> ;
      <http://example.org#forValue> "${skill}" ;
      <http://www.w3.org/2000/01/rdf-schema#seeAlso> ?skillSubIndex.
  }

  GRAPH ?skillSubIndex {
    ?subEntry <http://example.org#entry> ?user.
  }

  BIND (REPLACE(?user, "#me", "", "i") AS ?userProfile)

  GRAPH ?userProfile {
    ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
    <http://xmlns.com/foaf/0.1/#family_name> ?lastName;
    <http://example.org/#city> ?city;
    <http://example.org/#skills> ?skills.
  }
} LIMIT 100`;

export const cityTraversalQuery = `SELECT DISTINCT ?user ?firstName ?lastName ?city ?skills WHERE {
  ?cityIndex a <http://example.org#CityIndex>;
  <http://example.org#entry> ?user.
  ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
  <http://xmlns.com/foaf/0.1/#family_name> ?lastName;
  <http://example.org/#city> ?city;
  <http://example.org/#skills> ?skills.
} LIMIT 100`;

export const skillCityTraversalQuery = `SELECT DISTINCT ?user ?firstName ?lastName ?city ?skills WHERE {
  ?skillIndex a <http://example.org#SkillIndex>;
  <http://example.org#entry> ?user.
  ?cityIndex a <http://example.org#CityIndex>;
  <http://example.org#entry> ?user.
  ?user <http://xmlns.com/foaf/0.1/#firstName> ?firstName;
  <http://xmlns.com/foaf/0.1/#family_name> ?lastName;
  <http://example.org/#city> ?city;
  <http://example.org/#skills> ?skills.
} LIMIT 100`;

export const skillCityTraversalMetaQuery = (t: Targets) => `SELECT DISTINCT ?user WHERE {
  ${t.skills.map(s => `?${s} a <http://example.org#SourceSelectionIndexRegistration>;
  <http://example.org#forProperty> <http://example.org#hasSkill>;
  <http://example.org#forValue> "${s}";
  <http://example.org#instancesIn> ?indexSkill${s};
  <http://example.org#hasSource> ?source.`)}

  ${t.cities.map(c => `?${c} a <http://example.org#SourceSelectionIndexRegistration>;
  <http://example.org#forProperty> <http://example.org#hasLocation>;
  <http://example.org#forValue> "${c}";
  <http://example.org#instancesIn> ?indexCity${c};
  <http://example.org#hasSource> ?source.`)}

  ${t.skills.map(s => `?indexSkill${s} a <http://example.org#SkillIndex>;
  <http://example.org#entry> ?user.`)}

  ${t.cities.map(c => `?indexCity${c} a <http://example.org#CityIndex>;
  <http://example.org#entry> ?user.`)}
} LIMIT 100`;

export const skillCityFromDistributedMetaIndexQuery = (t: Targets) => `SELECT DISTINCT ?indexes WHERE {
  ${t.skills.map(s => `?${s} a <http://example.org#SourceSelectionIndexRegistration>;
  <http://example.org#forProperty> <http://example.org#hasSkill>;
  <http://example.org#forValue> "${s}";
  <http://example.org#instancesIn> ?indexSkill${s};
  <http://example.org#hasSource> ?source.`)}

  ${t.cities.map(c => `?${c} a <http://example.org#SourceSelectionIndexRegistration>;
  <http://example.org#forProperty> <http://example.org#hasLocation>;
  <http://example.org#forValue> "${c}";
  <http://example.org#instancesIn> ?indexCity${c};
  <http://example.org#hasSource> ?source.`)}
} LIMIT 100`;

export const sourcesFromDistributedMetaIndexQuery = (t: Targets) => `SELECT DISTINCT ?instancesSkill ?instancesCity WHERE {
  ${t.skills.reduce((ps, cs) => `${ps}\n?${cs} a <http://example.org#SourceSelectionIndexRegistration>;
  <http://example.org#forProperty> <http://example.org#hasSkill>;
  <http://example.org#forValue> "${cs}";
  <http://example.org#instancesIn> ?instancesSkill;
  <http://example.org#hasSource> ?source.\n`, "")}
  ${t.cities.reduce((pc, cc) => `${pc}\n?${cc} a <http://example.org#SourceSelectionIndexRegistration>;
  <http://example.org#forProperty> <http://example.org#hasLocation>;
  <http://example.org#forValue> "${cc}";
  <http://example.org#instancesIn> ?instancesCity;
  <http://example.org#hasSource> ?source.`, "")}
} LIMIT 100`;