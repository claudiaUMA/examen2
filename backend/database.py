import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# 1. Cargar variables del archivo .env
load_dotenv()

# 2. Obtener la URI
MONGO_URI = os.getenv("MONGO_URI")

# 3. Crear cliente y conexión a la BD
client = AsyncIOMotorClient(MONGO_URI)
db = client.reviews_db
collection = db.reviews