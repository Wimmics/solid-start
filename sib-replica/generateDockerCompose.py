import csv

instances = 32

def generateStatic():
    return """services:
  sib-replica:
    image: solidproject/community-server:7.0.2
    restart: always
    container_name: sib-replica
    environment:
      - CSS_SEED_CONFIG=/data/seeds.json
      - CSS_BASE_URL=http://localhost:8000
      - CSS_PORT=8000
    volumes:
      - ./data/sib-replica/:/data
    ports:
      - 8000:8000\
      
    """

def generateInstance(i):
    return f"""\
  sib{str(i)}:
    image: solidproject/community-server:7.0.2
    #restart: always
    container_name: sib{str(i)}
    environment:
      - CSS_SEED_CONFIG=/data/seeds.json
      - CSS_BASE_URL=http://localhost:{8000 + i}
      - CSS_PORT=8000
    volumes:
      - ./data/instances/{str(i)}/:/data
      - ./data/instances/{str(i)}/seeds.json:/data
    ports:
      - {8000 + i}:8000\
        
    """

print(generateStatic())
for i in range(1, instances + 1):
    print(generateInstance(i))
