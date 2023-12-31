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