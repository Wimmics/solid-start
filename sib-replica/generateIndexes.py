import os

skills = 600
instances = 32
usersPerInstance = 40
skillsPerUser = 5

def skillGenerator():
    i = 1
    while True:
        result = i % (skills + 1)
        if result > 0:
            yield result
        i += 1

def generateGlobalIndex(skill, value):
    filename = f"""./data/app/org/index/index{skill}$.ttl"""
    print(f"""Generate {filename}""")
    f = open(filename, "w")
    f.write("@prefix index: <http://example.org#>.\n\n")
    f.write("<> a index:Index;\n")
    f.write("\tindex:entry ")
    entries = ""
    for instance, user in value:
        entries += f"""\t<http://localhost:{8000 + instance}/user{user}/profile/card#me>,\n"""
    entries = entries[:-2] + ".\n"
    f.write(entries)
    f.close()

def generateInstanceIndex(instance, skill, users):
    filename = f"""./data/instances/{instance}/org/index$.ttl"""
    print(f"""Generate {filename}""")
    f = open(filename, "w")
    f.write("@prefix index: <http://example.org#>.\n\n")
    f.write("<> a index:Index;\n")
    f.write("\tindex:entry ")

skillGenerator = skillGenerator()

index = {} # [skill] => [ (instance, user), ... ]
indexByInstance = {} # [instance] => { skill => [ user, ... ] }

for instance in range(1, instances + 1):
    for user in range(1, usersPerInstance + 1):
        for skill in range(0, skillsPerUser):
            userSkill = next(skillGenerator)
            if userSkill not in index:
                index[userSkill] = []
            if instance not in indexByInstance:
                indexByInstance[instance] = {}
            if userSkill not in indexByInstance[instance]:
                indexByInstance[instance][userSkill] = []
            index[userSkill].append((instance, user))
            indexByInstance[instance][userSkill].append(user)

os.makedirs(os.path.dirname("./data/app/org/index/"), exist_ok=True)

for skill, value in index.items():
    generateGlobalIndex(skill, value)

#for i, value in indexByInstance.items():
#for skill, user in indexByInstance[3].items():
#    print(f'''<http://example.org/skill#{skill}> <http://localhost:8001/user{user[0]}/card#me>''')

#print(indexByInstance)

# Generate ACL
f = open("./data/app/org/index/.acl", "w")
f.write('''
# Root ACL resource for the agent account
@prefix acl: <http://www.w3.org/ns/auth/acl#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.

# The homepage is readable by the public
<#public>
    a acl:Authorization;
    acl:agentClass foaf:Agent;
    acl:accessTo <./>;
    acl:default <./>;
    acl:mode acl:Read.
''')
f.close()