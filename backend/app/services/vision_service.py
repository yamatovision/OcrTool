from google.cloud import vision
from google.cloud.vision_v1 import ImageAnnotatorClient
from ..core.exceptions import OCRProcessingException
import io

class VisionService:
    def __init__(self):
        try:
            # デフォルトの認証情報を使用
            self.client = ImageAnnotatorClient()
        except Exception as e:
            # より詳細なエラー情報を記録
            import traceback
            error_details = traceback.format_exc()
            raise OCRProcessingException(f"Failed to initialize Vision API client: {str(e)}\nDetails: {error_details}")

    async def detect_text(self, image_content: bytes) -> str:
        try:
            image = vision.Image(content=image_content)
            response = self.client.text_detection(image=image)
            
            if response.error.message:
                raise OCRProcessingException(
                    f'Vision API error: {response.error.message}'
                )
                
            texts = response.text_annotations
            if texts:
                return texts[0].description
            return ""
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            raise OCRProcessingException(f"Text detection failed: {str(e)}\nDetails: {error_details}")