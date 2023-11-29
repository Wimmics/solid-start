import csv
import os

instances = 32
usersPerInstance = 40

def generateSeeds():
    result = "["
    for user in range(1, usersPerInstance + 1):
        result += generateSeed(f'''user{str(user)}''') + ","
    result = result[:-1]
    result += "]"
    return result

def generateSeed(userString):
    return f'''{{"email":"{userString}@example.org", \
        "password":"123456", \
        "pods":[{{"name":"{userString}"}}]}}'''

for instance in range(1, instances + 1):
    filename = f'''./data/instances/{instance}/seeds.json'''
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    f = open(filename, "w")
    f.write(generateSeeds())
    f.close()

# generate organization account + POD
filename = f'''./data/app/seeds.json'''
os.makedirs(os.path.dirname(filename), exist_ok=True)
f = open(filename, "w")
result = "["
result += generateSeed("org")
result += "]"
f.write(result)
f.close()