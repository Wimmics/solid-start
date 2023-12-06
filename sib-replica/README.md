# Query multiple Solid PODs using indexes

This project is a demo of a web app able to find users spread across multiple Solid PODs very fast thanks to indexes queried with Comunica.

Indexes can be federated (merged into the  POD of the federation) or local (on each federation POD).

The app can currently find and display users given two criteria: their skills and their location (city). Each skill and city is indexed in dedicated documents hosted on the general POD (the "org" POD used by the application).

The dataset is generated from the `users.csv` file at the root of the project.

## Get started

Before to run the app, execute the following commands in the *sib-replica* folder:
```sh
python generateDockerCompose.py > docker-compose.yml
python generateSeeds.py
# You may have to execute the following instructions in root mode
docker compose up -d # this could take a while as it will start 32 CSS instances
python generateProfiles.py # be sure to wait for the PODs to be created (docker logs -f sib1)
python generateIndexes.py
```

Then to run the app do:
```sh
cd app
npm install && npm start
```

Go to http://localhost:3000.

In the skill input field, type the number of a skill that exist in the `users.csv` file. This number represents the skill (PHP, Python, Semantic Web, etc). Then click "Add to query". Repeat this step to query more skills.

You can also add a city as a second criteria to the query using the second input. Type the name of a city that exist in the `users.csv` file that you used to generate the data. Then click "Add to query". Repeat this step to query more locations.

Then click on:
- "Query" to fetch only the WebID of users;
- or on "Query traversal" to fetch the name and the city of users.

## Indexes

The `generateIndexes.py` script will create an index file for each distinct skill and city found in the `users.csv` file.

- The skill indexes will be created in the *./data/app/org/indexes/skill/* folder.
- The city indexes will be created in the *./data/app/org/indexes/city/* folder.

It will also create the *.acl* file (ACL) to allow the app to query the indexes publicly (simpler).

## Info

The app was created with these commands:
```
npx create-react-app app --template typescript
npm install @comunica/query-sparql @comunica/query-sparql-link-traversal ldflex @ldflex/comunica
```

The `generateSeeds.py` script generate the files which will serve to populate the CSS instances. It will generate a `seeds.json` file inside each `data/instances/<instance>` folder. These files will be passed to CSS thanks to env variables. CSS will create accounts and PODs based on these seeds.json files.

The `generateDockerCompose.py` script will generate the `docker-compose.yml` file containing multiple CSS instances.

The `generateProfiles.py` script will generate the profile document of each user and replace the one created by default by CSS.