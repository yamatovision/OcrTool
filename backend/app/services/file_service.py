from pathlib import Path
from typing import List
from fastapi import UploadFile
from ..core.config import get_settings
from ..core.exceptions import FileUploadException

settings = get_settings()

def validate_files(files: List[UploadFile]):
    if len(files) > settings.MAX_FILES:
        raise FileUploadException(f"Maximum {settings.MAX_FILES} files allowed")
    
    for file in files:
        # ファイル拡張子の確認
        ext = Path(file.filename).suffix[1:].lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise FileUploadException(
                f"File type not allowed. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
