# Query multiple Solid PODs using indexes

This project aims to compare different indexing strategies in order to find users spread across multiple Solid PODs. Users can be found given their skills or city.

We provide:
- Some Python scripts to deploy Community Solid Server (CSS) instances populated with some data (see the "Scripts" section below).
- A querying app to test different indexing strategies (see the "How to use..." section below).

The querying app is using React and Comunica and is written in TypeScript.

## Get started

Before to run the app, execute the following commands in the *sib-replica* folder:
```sh
# Adapt the content of config.json to your needs

# Generate a docker compose file that will let you run multiple CSS instances
python generateDockerCompose.py > docker-compose.yml 

# This will create seeds.json file for each instance. The seeds.json files will contain directives to create accounts and PODs.
python generateSeeds.py 

# This will start the deployment of the CSS instances
docker compose up -d

# Be sure to wait for the all the PODs to be created (docker logs -f sib1)

# If you run docker in root, change the owner of the data directory so you can execute the below scripts without sudo privileges.
sudo chown -R <user>:<user> ./data/ # replace <user> with your account

# Scripts to populate PODs
python generateProfiles.py # generate the WebID profile documents
python generateIndexes.py # generate the different kinds of indexes

# Scripts to adapt the testing application
python adaptApp.py # adapts the application to the content of config.json
```

Then to run the querying app do:
```sh
cd app
npm install && npm start
```

## How to use the querying app

Go to http://localhost:3000. The interface is divided into 3 parts: query, strategies and results, explained just below.

### 1. Make the query

In the skill input field, type the number of a skill that exist in the `users.csv` file. This number represents the skill (PHP, Python, Semantic Web, etc). Then click "Add to query". Repeat this step to query more skills.

You can also add a city as a second criteria to the query using the second input. Type the name of a city that exist in the `users.csv` file that you used to generate the data. Then click "Add to query". Repeat this step to query more locations.

### 2. Select indexing strategies to compare

The second part of the interface presents a list of indexing strategies that you can compare.

Just check the box of the strategies that you are interested in.

You can click on "See/hide SPARQL query" to see the SPARQL query that will be executed by the strategy.

You can also view the expected sources that will be queried by the strategy by clicking on "See/hide targeted sources".

### 3. Get the results

Once you clicked on the "Launch" button, you will see the result for each strategy you have selected.

If you have selected multiple strategies they will be executed sequentially.

You will see the time ellapsed by each strategy and the associated results (matched users).

## Indexing strategies

The different strategies are defined in the `strategies.ts` file in the */app/src/* folder.

To add a new indexing strategy, you have to add it to the list by providing a `Strategy` implementation object like `StrategyComunica`. 

### Add a new strategy

You can construct a `StrategyComunica` by giving the following parameters to the constructor:

```TS
name: string, // the name of the stragy
description: string, // its description
sparqlQuery: string, // the SPARQL request
engine: any, // the Comunica engine
sourceProviderFactory: (targets: Targets) => SourceProvider, // the source provider
matchDisplay?: (binding: any) => string // extra function to customize the display of each matched user
```

The `name`, `description` and the `sparqlQuery` will be displayed on the interface. 

The `engine` can be any Comunica engine like:
```TS
const QueryEngine = require('@comunica/query-sparql').QueryEngine; // a regular SPARQL engine
const QueryEngineTraversal = require('@comunica/query-sparql-link-traversal').QueryEngine; // a SPARQL engine with link traversal
```

The `sourceProviderFactory` arg is a function that returns a a `SourceProvider` object containing a list of URI corresponding to the passed in targets (`Targets`). Targets is a list of skills and cities.

The `matchDisplay` arg is a function to customize the text that will be returned as the representation of a matched user. It takes a Comunica binding.

Example:
```TS
new StrategyComunica(
    "Global-Skill", // the name of the stragy
    "Query the global indexes to find users with the given skills (cities are ignored).", // its description
    skillQuery, // the SPARQL request
    new QueryEngine(), // the Comunica engine
    (t: Targets) => new GlobalSourceProvider().addSkills(t.skills), // the source provider
    matchedUserToStringFunction // extra function to customize the display of each matched user
)
```

### Add the corresponding indexes

Adding a new strategy does not mean adding the corresponding indexes. Indeed, when you define a new strategy, you probably will want to use specific indexes. You should generate them before so they will be available on the queried PODs (prior to launch the execution). See the `generateIndexes` script in the next section.

## Scripts

### `generateIndexes`

*TODO: add generic methods to avoid code duplication.*

In its current state, the `generateIndexes.py` script will create an index file for each distinct skill and city found in the `users.csv` file. One single instance and POD of the federation is special and is called the organisation's POD. It will host the global indexes.

The "global" generation will make these indexes available on the organisation's POD:
- The skill indexes will be created in the *./data/app/org/indexes/skill/* folder.
- The city indexes will be created in the *./data/app/org/indexes/city/* folder.

The "local" generation will make these indexes available on each POD of the regular instances:
- The skill indexes will be created in the *./data/instances/<number>/indexes/skill/* folder.
- The city indexes will be created in the *./data/instances/<number>/indexes/city/* folder.

This script will also create the *.acl* file (ACL) to allow the app to query the indexes publicly (simpler).

### `generateSeeds`

The `generateSeeds.py` script generate the files which will serve to populate the CSS instances. It will generate a `seeds.json` file inside the organisation's POD and inside each `data/instances/<instance>` folder. These files will be passed to CSS thanks to env variables. CSS will create accounts and PODs based on these seeds.json files.

### `generateDockerCompose`

The `generateDockerCompose.py` script will generate the `docker-compose.yml` file containing multiple CSS instances.

The `generateProfiles.py` script will generate the profile document of each user and replace the one created by default by CSS.

## Info

The app was created with these commands:
```
npx create-react-app app --template typescript
npm install @comunica/query-sparql @comunica/query-sparql-link-traversal ldflex @ldflex/comunica
```
