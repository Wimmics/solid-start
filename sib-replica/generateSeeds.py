import json
import os
import users

instances = {} # instance => [users]

def generateInstanceSeeds(instance):
    return [
        user.generateSeed() for user in instances[instance]
    ]

def populateInstances(user):
    if user.instance not in instances:
        instances[user.instance] = []
    instances[user.instance].append(user)

for user in users.all():
    populateInstances(user)

# Generate users account + POD
for instance in instances:
    filename = f'''./data/instances/{str(instance)}/seeds.json'''
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        json.dump(generateInstanceSeeds(instance), f, indent="  ")

# generate organization account + POD
filename = f'''./data/app/seeds.json'''
os.makedirs(os.path.dirname(filename), exist_ok=True)
with open(filename, "w") as f:
    json.dump(
        [
            {
                "email": "org@example.org",
                "password": "123456",
                "pods": [
                    { "name": "org" },
                ]
            }
        ],
        f,
        indent="  ",
    )
