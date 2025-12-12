from pydantic import BaseModel
from typing import Optional

class ReviewModel(BaseModel):
    place_name: str
    address: str
    rating: int  # 0 a 5
    image_url: Optional[str] = None
    
    # Datos del token (Autoría)
    author_name: str
    author_email: str
    token_expiry: str

class ReviewModel(BaseModel):
    # ... (resto de campos igual)
    author_name: str
    author_email: str
    token_expiry: str
    token_issued: str  # <--- AÑADE ESTO