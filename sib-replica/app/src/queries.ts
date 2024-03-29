export const skillQuery = `SELECT DISTINCT ?user WHERE {
    ?skillIndex a <http://example.org#SkillIndex>;
    <http://example.org#entry> ?user
  } LIMIT 100`;

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