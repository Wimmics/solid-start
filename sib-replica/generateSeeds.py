import csv

instances = 32
usersPerInstance = 40

def generateSeeds():
    result = "["
    for user in range(1, usersPerInstance + 1):
        result += generateSeed(user) + ","
    result = result[:-1]
    result += "]"
    return result

def generateSeed(user):
    return f'''\{"email":"user{str(user)}@example.org", \
        "password":"123456", \
        "pods":[\{"name":"user{str(user)}"\}]\}'''

#for instance in range(1, instances + 1):
f = open("./data/instances/1/seeds.json", "w")
f.write(generateSeeds())
f.close()