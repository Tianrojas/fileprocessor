stored_bytes = None
stored_filename = None

def save_file(file):
    global stored_bytes, stored_filename

    stored_bytes = file.read()
    stored_filename = file.filename


def get_file():
    return stored_bytes, stored_filename
