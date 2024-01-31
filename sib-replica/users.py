import csv

userFile = "./data/users.csv"

class User:

    def __init__(self, userInfo):
        self.instance = int(userInfo[0])
        self.number = int(userInfo[1])
        self.webId = f'''http://localhost:{8000 + self.instance}/user{str(self.number)}/profile/card#me'''
        self.firstName = userInfo[2]
        self.lastName = userInfo[3]
        self.email = userInfo[4]
        self.skills = [userInfo[5],userInfo[6],userInfo[7],userInfo[8],userInfo[9]]
        self.city = userInfo[10]

    def generateProfile(self):
        return f'''@prefix foaf: <http://xmlns.com/foaf/0.1/#>.
    @prefix solid: <http://www.w3.org/ns/solid/terms#>.
    @prefix ex: <http://example.org/#>.

    <>
        a foaf:PersonalProfileDocument;
        foaf:maker <{self.webId}>;
        foaf:primaryTopic <{self.webId}>.

    <{self.webId}>
        foaf:firstName "{self.firstName}";
        foaf:family_name "{self.lastName}";
        ex:city "{self.city}";
        ex:skills {', '.join(self.skills)};
        solid:oidcIssuer <http://localhost:8000/>;
        a foaf:Person.'''

    def generateSeed(self):
        return {
            "email": self.email,
            "password": "123456",
            "pods": [
                {
                    "name": f"user{self.number}",
                }
            ]
        }

def all():
    with open(userFile, newline='') as users:
        reader = csv.reader(users, delimiter=';', quotechar='"')

        # Skip header
        next(reader)

        for userInfo in reader:
            yield User(userInfo)
