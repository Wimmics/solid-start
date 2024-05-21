import os
import users
import csv
import unicodedata

userFile = "./data/usersRandomFREN-5000.csv"
depth = 10

def process(data, user, name):
    for i in range(0, depth):
        if (len(name) >= i):
            letters = unicodedata.normalize('NFD', name[0:i+1])

            if (len(letters) > i):
                if (letters not in data[i]):
                    data[i][letters] = []
                
                data[i][letters].append(user)

def writeResult(file, items):
    for letter, users in sorted(items.items()):
        f.write(f''':{letter} ex:forValue "{letter}";\n''')
        userList = ''
        for user in users:
            userList = userList + (f'''{user},\n''')
        f.write(f'''\tex:instance {userList[:-2]}.\n''')
        f.write("\n")

with open(userFile, newline='') as users:
    reader = csv.reader(users, delimiter=';', quotechar='"')

    # Skip header
    next(reader)

    dataFirstName = []
    dataLastName = []
    for i in range(0, depth):
        dataFirstName.append({})
        dataLastName.append({})

    for userInfo in reader:
        # Remove accents and transform to lowercase.
        lastName = unicodedata.normalize('NFD', userInfo[0].lower())
        firstName = unicodedata.normalize('NFD', userInfo[1].lower())
        user = f'''<http://example.org/{firstName}-{lastName}.ttl>'''.replace(' ', '-')

        process(dataFirstName, user, firstName)
        process(dataLastName, user, lastName)

    # Write user indexes by names
    for i in range(0, depth):
        firstNameIndex = f"""./string-index/firstNameIndex{i+1}$.ttl"""
        lastNameIndex = f"""./string-index/lastNameIndex{i+1}$.ttl"""

        os.makedirs(os.path.dirname(firstNameIndex), exist_ok=True)
        f = open(firstNameIndex, "w")
        writeResult(f, dataFirstName[i])
        f.close()

        os.makedirs(os.path.dirname(lastNameIndex), exist_ok=True)
        f = open(lastNameIndex, "w")
        writeResult(f, dataLastName[i])
        f.close()

    # Fist name meta index
    level = 1
    for levels in dataFirstName:
        for letters, user in sorted(levels.items()):
            print("a ex:IndexStartsWithRegistration;")
            print("\tforProperty ex:firstName;")
            print(f'''\tex:startsWith "{letters}";''')
            print(f'''\trdfs:seeAlso <path/to/firstName{level}.ttl>.\n''')
        level += 1
        break
