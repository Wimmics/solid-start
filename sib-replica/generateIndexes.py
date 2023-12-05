import os
import users

userFile = "./data/users.csv"
globalCityIndex = {}
globalSkillIndex = {}

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

def populateGlobalCityIndex(user):
    if user.city not in globalCityIndex:
        globalCityIndex[user.city] = []
    globalCityIndex[user.city].append(user)

def populateGlobalSkillIndex(user):
    for skill in user.skills:
        if skill not in globalSkillIndex:
            globalSkillIndex[skill] = []
        globalSkillIndex[skill].append(user)

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

for user in users.all():
    populateGlobalCityIndex(user)
    populateGlobalSkillIndex(user)

print("Generate city indexes")
for city in globalCityIndex:
    generateGlobalCityIndex(city)
generateACL("./data/app/org/indexes/city/.acl")

print("Generate skill indexes")
for skill in globalSkillIndex:
    generateGlobalSkillIndex(skill)
generateACL("./data/app/org/indexes/skill/.acl")
