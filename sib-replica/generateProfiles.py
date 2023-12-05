import os
import users

for user in users.all():
    profileDocument = f'''./data/instances/{str(user.instance)}/user{str(user.number)}/profile/card$.ttl'''
    os.makedirs(os.path.dirname(profileDocument), exist_ok=True)

    profile = user.generateProfile()

    f = open(profileDocument, "w")
    f.write(profile)
    f.close()
