from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from geopy.geocoders import Nominatim
from datetime import datetime

# Importamos nuestros módulos nuevos
from database import collection
from schemas import ReviewCreate, ReviewResponse
# Nota: models.py se usa implícitamente a través de schemas

app = FastAPI()

# Configuración CORS
origins = ["http://localhost:3000", "https://tu-url-vercel.app"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Geocoding
geolocator = Nominatim(user_agent="reviews_app_examen")

@app.get("/reviews", response_model=list[ReviewResponse])
async def get_reviews():
    reviews = []
    async for review in collection.find():
        # Convertimos _id de Mongo a string para el frontend
        review["id"] = str(review["_id"])
        reviews.append(review)
    return reviews

@app.post("/reviews")
async def create_review(review: ReviewCreate):
    # 1. Geocoding: Obtener lat/lon de la dirección
    try:
        location = geolocator.geocode(review.address)
        if location:
            lat, lon = location.latitude, location.longitude
        else:
            lat, lon = 0.0, 0.0 # Por defecto si falla
    except:
        lat, lon = 0.0, 0.0

    # 2. Crear diccionario para guardar
    new_review = review.dict()
    new_review["coordinates"] = {"lat": lat, "lon": lon}
    new_review["created_at"] = datetime.utcnow()

    # 3. Guardar en Mongo usando la colección importada de database.py
    result = await collection.insert_one(new_review)
    
    return {
        "id": str(result.inserted_id), 
        "coordinates": new_review["coordinates"]
    }