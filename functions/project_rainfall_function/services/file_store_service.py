import zcatalyst_sdk

def upload_to_filestore(request):

    app = zcatalyst_sdk.initialize()
    filestore = app.filestore()

    folder_id = 40958000000062360
    folder = filestore.folder(folder_id)

    file = request.files.get("file")

    if not file:
        raise ValueError("No file")
    

    print("filename:", file.filename)
    print("content length:", len(file.read()))
    file.seek(0)
    if not isinstance(file, BufferReader):
        print("file is not a BufferReader")

    uploaded = folder.upload_file(file.filename, file)

    return uploaded["file_id"]


def download_from_filestore(file_id):

    app = zcatalyst_sdk.initialize()
    filestore = app.filestore()

    folder_id = 40958000000062360
    folder = filestore.folder(folder_id)

    file_obj = folder.file(file_id)

    temp_path = f"/tmp/{file_id}"

    file_obj.download(temp_path)

    return temp_path