import csv
import os

userFile = "./data/users.csv"

def generateProfile(instance, userNumber, userInfo):
    firstName = userInfo[0]
    lastName = userInfo[1]
    email = userInfo[2]
    uri = f'''http://localhost:{8000 + instance}/user{userNumber}/profile/card#me'''

    return f'''@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/#>.

<>
    a foaf:PersonalProfileDocument;
    foaf:maker <{uri}>;
    foaf:primaryTopic <{uri}>.

<{uri}>
    foaf:firstName "{firstName}";
    foaf:family_name "{lastName}";
    solid:oidcIssuer <http://localhost:8000/>;
    a foaf:Person.'''

with open(userFile, newline='') as users:
    reader = csv.reader(users, delimiter=',', quotechar='"')

    instance = 1;
    user = 0;

    for userInfo in reader:
        if user == 0:
            user = 1
            continue

        profileDocument = f'''./data/instances/{instance}/user{user}/profile/card$.ttl'''
        os.makedirs(os.path.dirname(profileDocument), exist_ok=True)
        profile = generateProfile(instance, user, userInfo)

        f = open(profileDocument, "w")
        f.write(profile)
        f.close()

        if user == 40:
            user = 1 
            instance += 1
        else:
            user += 1
