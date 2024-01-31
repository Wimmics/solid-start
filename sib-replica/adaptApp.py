import json
import pathlib
import re

CONFIG = json.load(open("config.json"))
INSTANCES = CONFIG['instances']

path = pathlib.Path() / "app" / "src" / "strategies.ts"
assert path.exists()
with path.open() as f:
    old_js = f.read()
    new_js = re.sub('const NB_INSTANCES = [0-9]+', f'const NB_INSTANCES = {INSTANCES}', old_js)
with path.open('w') as f:
    f.write(new_js)
