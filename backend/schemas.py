# backend/schemas.py
from pydantic import BaseModel
from typing import Optional, Dict
from models import ReviewModel  # <--- Al importar esto, ya trae el campo nuevo

# Hereda de ReviewModel, así que YA TIENE token_issued automáticamente
class ReviewCreate(ReviewModel):
    pass

# Hereda de ReviewModel, así que YA TIENE token_issued automáticamente
class ReviewResponse(ReviewModel):
    id: str
    coordinates: Dict[str, float]