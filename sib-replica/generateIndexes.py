import os
import users

userFile = "./data/users.csv"

# Indexes that are on the POD of the federation
globalCityIndex = {} # { city => [users] }
globalSkillIndex = {} # { skill => [users] }

# Indexes that are on each instance
localSkillIndex = {} # { instance => { skill => [users] } }
localCityIndex = {} # { instance => { city => [users] } }

def generateIndexHeader(indexType):
    return f'''@prefix ex: <http://example.org#>.

    <> a {indexType};
    '''

def generateIndexEntry(entry):
    return f'''index:entry {entry},'''

def generateACL(filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    f = open(filename, "w")
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

def populateCityIndexes(user):
    if user.city not in globalCityIndex:
        globalCityIndex[user.city] = []
    if user.instance not in localCityIndex:
        localCityIndex[user.instance] = {}
    if user.city not in localCityIndex[user.instance]:
        localCityIndex[user.instance][user.city] = []
    globalCityIndex[user.city].append(user)
    localCityIndex[user.instance][user.city].append(user)

def populateSkillIndexes(user):
    for skill in user.skills:
        if skill not in globalSkillIndex:
            globalSkillIndex[skill] = []
        if user.instance not in localSkillIndex:
            localSkillIndex[user.instance] = {}
        if skill not in localSkillIndex[user.instance]:
            localSkillIndex[user.instance][skill] = []
        globalSkillIndex[skill].append(user)
        localSkillIndex[user.instance][skill].append(user)

def generateGlobalSkillIndex(skill):
    filename = f"""./data/app/org/indexes/skill/{skill}$.ttl"""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    f = open(filename, "w")
    f.write(generateIndexHeader('ex:SkillIndex'))
    f.write("\tex:entry ")
    
    entries = ""
    for user in globalSkillIndex[skill]:
        entries += f"""<{user.webId}>,\n\t\t"""
    entries = entries[:-4] + ".\n"
    f.write(entries)
    f.close()

def generateGlobalCityIndex(city):
    filename = f"""./data/app/org/indexes/city/{city}$.ttl"""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    f = open(filename, "w")
    f.write(generateIndexHeader('ex:CityIndex'))
    f.write("\tex:entry ")
    
    entries = ""
    for user in globalCityIndex[city]:
        entries += f"""<{user.webId}>,\n\t\t"""
    entries = entries[:-4] + ".\n"
    f.write(entries)
    f.close()

def generateLocalCityIndex(instance):
    for city in localCityIndex[instance]:
        filename = f"""./data/instances/{str(instance)}/indexes/city/{city}$.ttl"""
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        f = open(filename, "w")
        f.write(generateIndexHeader('ex:CityIndex'))
        f.write("\tex:entry ")
        
        entries = ""
        for user in localCityIndex[instance][city]:
            entries += f"""<{user.webId}>,\n\t\t"""
        entries = entries[:-4] + ".\n"
        f.write(entries)
        f.close()

def generateLocalSkillIndex(instance):
    for skill in localSkillIndex[instance]:
        filename = f"""./data/instances/{str(instance)}/indexes/skill/{skill}$.ttl"""
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        f = open(filename, "w")
        f.write(generateIndexHeader('ex:SkillIndex'))
        f.write("\tex:entry ")
        
        entries = ""
        for user in localSkillIndex[instance][skill]:
            entries += f"""<{user.webId}>,\n\t\t"""
        entries = entries[:-4] + ".\n"
        f.write(entries)
        f.close()

for user in users.all():
    populateCityIndexes(user)
    populateSkillIndexes(user)

print("Generate federated city indexes")
for city in globalCityIndex:
    generateGlobalCityIndex(city)
generateACL("./data/app/org/indexes/city/.acl")

print("Generate local city indexes")
for instance in localCityIndex:
    generateLocalCityIndex(instance)
    generateACL(f'''./data/instances/{instance}/indexes/city/.acl''')

print("Generate skill indexes")
for skill in globalSkillIndex:
    generateGlobalSkillIndex(skill)
generateACL("./data/app/org/indexes/skill/.acl")

print("Generate local skill indexes")
for instance in localSkillIndex:
    generateLocalSkillIndex(instance)
    generateACL(f'''./data/instances/{instance}/indexes/skill/.acl''')
