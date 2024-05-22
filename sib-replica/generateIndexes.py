import os
import users

userFile = "./data/users.csv"

# Indexes that are on the POD of the federation
globalCityIndex = {} # { city => [users] }
globalSkillIndex = {} # { skill => [users] }

# Indexes that are on each instance
localSkillIndex = {} # { instance => { skill => [users] } }
localCityIndex = {} # { instance => { city => [users] } }

def generateIndexHeader(indexType, isClosed = False):
    return f'''@prefix : <#>.
@prefix ex: <http://example.org#>.

<> a {indexType}{'.' if isClosed else ';'}
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

def generateFederatedRootIndex(filename, indexesUrl):
    skills = f"""{indexesUrl}skills"""
    cities = f"""{indexesUrl}cities"""

    index = f"""@prefix ex: <http://example.org#>.
    
<> a ex:Index.

<#1> a ex:PropertyIndexRegistration;
  ex:inIndex <>;
  ex:forProperty ex:forProperty;
  ex:forValue ex:hasSkill;
  ex:instancesIn <{skills}>.

<#2> a ex:PropertyIndexRegistration;
  ex:inIndex <>;
  ex:forProperty ex:forProperty;
  ex:forValue ex:hasCity;
  ex:instancesIn <{cities}>."""

    os.makedirs(os.path.dirname(filename), exist_ok=True)
    f = open(filename, "w")
    f.write(index)
    f.close()

def generateRootSkillIndex():
    index = '''@prefix ex: <http://example.org#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
    
<> a ex:Index.\n'''

    for i in range(1, 601):
        index += f"""\n<#skill{i}> a ex:PropertyIndexRegistration;
  \tex:inIndex <http://localhost:8000/org/indexes/skills>;
  \tex:forProperty ex:hasSkill;
  \tex:forValue "{i}";
  \trdfs:seeAlso <http://localhost:8000/org/indexes/skill/{i}>.\n"""
    
    filename = "./data/app/org/indexes/skills$.ttl"
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    f = open(filename, "w")
    f.write(index)
    f.close()

def generateDistributedRootIndex(instance):
    filename = f"""./data/instances/{str(instance)}/indexes/root$.ttl"""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    f = open(filename, "w")

    f.write(generateIndexHeader("ex:SourceSelectionIndex", True) + "\n")

    for skill in localSkillIndex[instance]:
        f.write(f""":{str(skill)} a ex:SourceSelectionIndexRegistration;
    ex:forProperty ex:hasSkill;
    ex:forValue "{str(skill)}";
    ex:instancesIn <http://localhost:{8000+instance}/indexes/skill/{str(skill)}>;
    ex:hasSource <http://localhost:{8000+instance}>.\n\n""")

    for city in localCityIndex[instance]:
        f.write(f""":{str(city)} a ex:SourceSelectionIndexRegistration;
    ex:forProperty ex:hasLocation;
    ex:forValue "{str(city)}";
    ex:instancesIn <http://localhost:{8000+instance}/indexes/city/{city}>;
    ex:hasSource <http://localhost:{8000+instance}>.\n\n""")
    
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

    print("Generate distributed city indexes")
    for instance in localCityIndex:
        generateLocalCityIndex(instance)
        generateACL(f'''./data/instances/{instance}/indexes/city/.acl''')

    print("Generate skill indexes")
    for skill in globalSkillIndex:
        generateGlobalSkillIndex(skill)
    generateACL("./data/app/org/indexes/skill/.acl")

    print("Generate distributed skill indexes")
    for instance in localSkillIndex:
        generateLocalSkillIndex(instance)
        generateACL(f'''./data/instances/{instance}/indexes/skill/.acl''')

    print("Generate federated root index")
    generateFederatedRootIndex("./data/app/org/indexes/root$.ttl", "http://localhost:8000/org/indexes/")
    generateACL('./data/app/org/indexes/.acl')

    print("Generate federated root skill index")
    generateRootSkillIndex()

print("Generate distributed root index")
for instance in range (1, 33):
    generateACL(f'''./data/instances/{instance}/indexes/.acl''')
    generateDistributedRootIndex(instance)
