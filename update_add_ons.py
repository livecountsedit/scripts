import cmd
import glob
import json
import datetime
import uuid
import os
from urllib.parse import urlparse

MAX_TITLE_LENGTH = 50
MAX_DESC_LENGTH = 200
MAX_AUTHOR_LENGTH = 50

def is_valid_url(url: str) -> bool:
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

class AddOnUpdater(cmd.Cmd):
    intro = 'Livecountsedit add-on updater\n-----\nhelp - list commands\nlist - list all add-ons (id, name, author)\nadd - create a new add-on\nupdate - update an existing add-on\nexit - self explanatory'
    prompt = '>> ' 

    def do_help(self, arg):
        print(self.intro[:-1])

    def do_list(self, arg):
        metadata_files = glob.glob('./listings/*/meta.json')
        for file in metadata_files:
            with open(file, 'r') as f:
                metadata = json.loads(f.read())
                print(f'{metadata['id']}: {metadata['title']} by {metadata['author']}')

    def do_add(self, arg):
        result = {}
        date = None
        while date is None: 
            date_input = input('When was this add-on created (YYYY-MM-DD, leave blank for today)?\n>>> ')
            try:
                date = datetime.date.today() if not date_input else datetime.date.fromisoformat(date_input)
                result['created'] = date.isoformat()
            except ValueError:
                print('Invalid date.')
        result['updated'] = result['published'] = datetime.date.today().isoformat()
        title = ''
        while not title:
            title_input = input(f'Title (max {MAX_TITLE_LENGTH} characters):\n>>> ')
            if not title_input:
                print('Please provide a title.')
            elif len(title_input) > MAX_TITLE_LENGTH:
                print('Your title is too long.')
            elif not title_input.isascii():
                print('Please remove all special characters.')
            else:
                title = title_input
        result['title'] = title
        desc = ''
        while not desc:
            desc_input = input(f'Description (max {MAX_DESC_LENGTH} characters, leave blank to repeat title):\n>>> ')
            if not desc_input:
                desc = title
            elif len(desc_input) > MAX_DESC_LENGTH:
                print('Your description is too long.')
            elif not desc_input.isascii():
                print('Please remove all special characters.')
            else:
                desc = desc_input
        result['description'] = desc
        author = ''
        while not author:
            author_input = input(f'Author (optional, max {MAX_AUTHOR_LENGTH} characters):\n>>> ')
            if not author_input:
                author = 'Anonymous'
            elif len(author_input) > MAX_AUTHOR_LENGTH:
                print('Author name is too long.')
            elif not author_input.isascii():
                print('Please remove all special characters.')
            else:
                author = author_input
        result['author'] = author
        url = ''
        while not url:
            url_input = input('Source URL:\n>>> ')
            if not url_input:
                print('Please provide a URL.')
            elif not is_valid_url(url_input):
                print('Invalid URL.')
            else:
                url = url_input
        result['url'] = url
        tags = []
        tag_input = input('Tags (comma separated, optional):\n>>> ')
        if not tag_input:
            pass
        else:
            split_tags = tag_input.lower().split(',')
            split_tags = [tag.strip() for tag in split_tags]
            tags = list(set(split_tags))
        result['tags'] = tags
        is_ai_input_valid = False
        is_ai = False
        while not is_ai_input_valid:
            is_ai_input = input('Is this add-on AI generated? (Yes/No)?\n>>> ')
            if is_ai_input.lower().strip() == 'yes':
                is_ai = True
                is_ai_input_valid = True
            elif is_ai_input.lower().strip() == 'no':
                is_ai_input_valid = True
            else:
                print('Please answer yes or no.')
        result['ai'] = is_ai
        result['id'] = str(uuid.uuid4())
        os.mkdir(f'listings/{result['id']}')
        with open(f'listings/{result['id']}/meta.json', 'w') as f:
            f.write(json.dumps(result, indent=4))
        print(f'{result['id']}: {result['title']} by {result['author']}')

    def do_update(self, arg):
        result = {}
        id = ""
        while not id:
            id_input = input('Enter the ID of the add-on you want to update (leave blank to cancel):\n>>> ')
            if not id_input:
                return
            try: 
                with open(f'listings/{id_input}/meta.json', 'r') as f:
                    result = json.loads(f.read())
                    id = id_input
            except FileNotFoundError:
                print('Invalid ID.')
        result['updated'] = datetime.date.today().isoformat()
        title = ''
        while not title:
            title_input = input(f'Title (max {MAX_TITLE_LENGTH} characters, leave blank to leave unchanged):\n>>> ')
            if not title_input:
                title = result['title']
            elif len(title_input) > MAX_TITLE_LENGTH:
                print('Your title is too long.')
            elif not title_input.isascii():
                print('Please remove all special characters.')
            else:
                title = title_input
        result['title'] = title
        desc = ''
        while not desc:
            desc_input = input(f'Description (max {MAX_DESC_LENGTH} characters, leave blank to leave unchanged):\n>>> ')
            if not desc_input:
                desc = result['description']
            elif len(desc_input) > MAX_DESC_LENGTH:
                print('Your description is too long.')
            elif not desc_input.isascii():
                print('Please remove all special characters.')
            else:
                desc = desc_input
        result['description'] = desc
        author = ''
        while not author:
            author_input = input(f'Author (optional, max {MAX_AUTHOR_LENGTH} characters, leave blank to leave unchanged):\n>>> ')
            if not author_input:
                author = result['author']
            elif len(author_input) > MAX_AUTHOR_LENGTH:
                print('Author name is too long.')
            elif not author_input.isascii():
                print('Please remove all special characters.')
            else:
                author = author_input
        result['author'] = author
        url = ''
        while not url:
            url_input = input('Source URL (leave blank to leave unchanged):\n>>> ')
            if not url_input:
                url = result['url']
            elif not is_valid_url(url_input):
                print('Invalid URL.')
            else:
                url = url_input
        result['url'] = url
        tags = []
        tag_input = input('Tags (comma separated, leave blank to leave unchanged, type CLEAR to clear):\n>>> ')
        if not tag_input:
            tags = result['tags']
        elif tag_input == 'CLEAR':
            pass
        else:
            split_tags = tag_input.lower().split(',')
            split_tags = [tag.strip() for tag in split_tags]
            tags = list(set(split_tags))
        result['tags'] = tags
        is_ai_input_valid = False
        is_ai = False
        while not is_ai_input_valid:
            is_ai_input = input('Is this add-on AI generated? (Yes/No, leave blank to leave unchanged)?\n>>> ')
            if not is_ai_input:
                is_ai = result['ai']
                is_ai_input_valid = True
            elif is_ai_input.lower().strip() == 'yes':
                is_ai = True
                is_ai_input_valid = True
            elif is_ai_input.lower().strip() == 'no':
                is_ai_input_valid = True
            else:
                print('Please answer yes or no.')
        result['ai'] = is_ai
        with open(f'listings/{result['id']}/meta.json', 'w') as f:
            f.write(json.dumps(result, indent=4))
        print(f'{result['id']}: {result['title']} by {result['author']}')

    def do_exit(self, arg):
        return True
    
if __name__ == '__main__':
    AddOnUpdater().cmdloop()