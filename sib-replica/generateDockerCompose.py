import csv

instances = 32

def generateStatic():
    return """services:
  app:
    image: solidproject/community-server:7.0.2
    restart: always
    container_name: app
    environment:
      - CSS_SEED_CONFIG=/data/seeds.json
      - CSS_BASE_URL=http://localhost:8000
      - CSS_PORT=8000
    volumes:
      - ./data/app/:/data
      - ./data/app/seeds.json:/data
    ports:
      - 8000:8000\
      
    """

# TODO: add depends_on to have a sequential loading of containers
def generateInstance(i):
  depends = ""
  if i > 1:
    depends = f'''depends_on:
      - sib{i-1}
    '''
    
  return f"""\
  sib{str(i)}:
    image: solidproject/community-server:7.0.2
    #restart: always
    container_name: sib{str(i)}
    {depends}
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
