# Query distributed data using indexes

This project is a demo of a web app able to query distributed instances very fast thanks to indexes.

It is designed to filter users by a criteria (skill). Every user is indexed by skill in dedicated documents: the `index1.ttl` lists every users who has the skill 1, the `index600.ttl` lists every users who has the skill 600 and so on. The querying app uses these indexes to respond to the query.

## Get started

Before to run the app, execute the following commands in the *sib-replica* folder:
```sh
docker compose up -d app
mkdir ./data/app/app/index/
python generateIndexes.py
```

Then to run the app do:
```sh
cd app
npm start
```

Go to http://localhost:3000.

In the input field, type a number between 1 and 600 (representing the skill) and click "Add to query". Repeat this step to query more skills.

Then click on "Refresh" to fetch the results.

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
npm install @comunica/query-sparql
```

A script has been started to generate a `docker-compose.yml` file with multiple CSS instances :
```sh
python generateDockerCompose.py > docker-compose.yml
```

The `generateSeeds.py` script will be used later to generate the POD of each user.