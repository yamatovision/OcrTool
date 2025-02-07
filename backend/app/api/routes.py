from fastapi import APIRouter, UploadFile, File
from typing import List
from ..services.vision_service import VisionService
from ..services.file_service import validate_files
from ..schemas.requests import OCRBatchResponse, OCRResponse

router = APIRouter()
vision_service = VisionService()

@router.post("/upload", response_model=OCRBatchResponse)
async def upload_files(files: List[UploadFile] = File(...)):
    # ファイルのバリデーション
    validate_files(files)
    
    results = []
    for file in files:
        content = await file.read()
        text = await vision_service.detect_text(content)
        results.append(OCRResponse(filename=file.filename, text=text))
    
    return OCRBatchResponse(results=results, total_files=len(results))
