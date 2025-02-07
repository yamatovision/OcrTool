from pydantic import BaseModel
from typing import List

class OCRResponse(BaseModel):
    filename: str
    text: str

class OCRBatchResponse(BaseModel):
    results: List[OCRResponse]
    total_files: int
