# Query distributed data using indexes

This project is a demo of a web app able to query distributed instances very fast thanks to indexes.

It is designed to filter users by a criteria (skill). Every user is indexed by skill in dedicated documents: the `index1.ttl` lists every users who has the skill 1, the `index600.ttl` lists every users who has the skill 600 and so on. The querying app uses these indexes to respond to the query.

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

In the input field, type a number between 1 and 600 (representing the skill) and click "Add to query". Repeat this step to query more skills.

Then click on "Query" or "Query traversal" to fetch the results.

## Indexes

The `generateIndexes.py` script will create 600 index files in the *./data/app/app/index/* folder. It will also create the *.acl* file (ACL) to allow the app to query the indexes publicly (simpler).

The script is configured with:
```py
skills = 600
instances = 32 # CSS instances
usersPerInstance = 40
skillsPerUser = 5 # number of skills assigned to each user
```

## Info

The app was created with these commands:
```
npx create-react-app app --template typescript
npm install @comunica/query-sparql @comunica/query-sparql-link-traversal ldflex @ldflex/comunica
```

The `generateSeeds.py` script generate the files which will serve to populate the CSS instances. It will generate a `seeds.json` file inside each `data/instances/<instance>` folder. These files will be passed to CSS thanks to env variables. CSS will create accounts and PODs based on these seeds.json files.

The `generateDockerCompose.py` script will generate the `docker-compose.yml` file containing multiple CSS instances.

The `generateProfiles.py` script will generate the profile document of each user and replace the one created by default by CSS.

The `generateProfiles.py` script will generate the global index owned by the organisation (the app container).