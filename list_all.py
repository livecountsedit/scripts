import glob
import json

def main():
    metadata_files = glob.glob('./listings/*/meta.json')
    result = {}
    for file in metadata_files:
        with open(file, 'r') as f:
            metadata = json.loads(f.read())
            result[metadata['id']] = metadata
            print(f'{metadata['id']}: {metadata['title']} by {metadata['author']}')
    with open('all.json', 'w') as f:
        f.write(json.dumps(result, indent=4))

if __name__ == '__main__':
    main()