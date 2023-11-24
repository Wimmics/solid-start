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

skillGenerator = skillGenerator()

index = {}

for instance in range(1, instances + 1):
    for user in range(1, usersPerInstance + 1):
        for skill in range(0, skillsPerUser):
            userSkill = next(skillGenerator)
            if userSkill not in index:
                index[userSkill] = []
            index[userSkill].append((instance, user))

for skill, value in index.items():
    filename = f"""./data/app/app/index/index{skill}$.ttl"""
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

# Generate ACL
f = open("./data/app/app/index/.acl", "w")
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