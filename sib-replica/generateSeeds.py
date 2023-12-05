import os
import users

instances = {} # instance => [users]

def generateInstanceSeeds(instance):
    result = "["
    for user in instances[instance]:
        result += user.generateSeed() + ","
    return result[:-1] + "]"

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
    f = open(filename, "w")
    f.write(generateInstanceSeeds(instance))
    f.close()

# generate organization account + POD
filename = f'''./data/app/seeds.json'''
os.makedirs(os.path.dirname(filename), exist_ok=True)
f = open(filename, "w")
result = "["
result += f'''{{"email":"org@example.org", \
        "password":"123456", \
        "pods":[{{"name":"org"}}]}}'''
result += "]"
f.write(result)
f.close()