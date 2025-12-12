'use client'; // Usamos cliente para manejar estados del mapa
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";

// Importación dinámica del mapa (CRÍTICO para evitar errores de compilación)
const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function Home() {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState([]);
    const [search, setSearch] = useState("");
    const [mapCenter, setMapCenter] = useState(null);

    // Cargar reseñas al inicio
    useEffect(() => {
        if (session) {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews`)
                .then(res => setReviews(res.data))
                .catch(err => console.error(err));
        }
    }, [session]);

    // Lógica de búsqueda para centrar el mapa (Geocoding simple en frontend)
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search) return;
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${search}`);
            if (res.data?.[0]) {
                setMapCenter([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]);
            }
        } catch (error) {
            alert("Dirección no encontrada");
        }
    };

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-black">
                <h1 className="text-3xl font-bold mb-6">ReViews Login</h1>
                <button onClick={() => signIn("google")} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                    Iniciar sesión con Google
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto text-black">
            {/* Cabecera */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Bienvenido, {session.user.name}</h1>
                <div className="space-x-4">
                    <Link href="/create" className="bg-green-600 text-white px-4 py-2 rounded">Crear Reseña</Link>
                    <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">Salir</button>
                </div>
            </div>

            {/* Buscador y Mapa */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        placeholder="Buscar dirección en el mapa..." 
                        className="border p-2 flex-grow rounded"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="bg-gray-800 text-white px-4 py-2 rounded">Buscar</button>
                </form>
                <Map reviews={reviews} center={mapCenter} />
            </div>

            {/* Listado de Reseñas */}
            <h2 className="text-xl font-bold mb-4">Reseñas Recientes</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {reviews.map((r) => (
                    <div key={r.id} className="border p-4 rounded shadow bg-white">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-lg">{r.place_name}</h3>
                            <span className="bg-yellow-100 text-yellow-800 px-2 rounded">⭐ {r.rating}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">📍 {r.address}</p>
                        
                        {/* Detalles Desplegables (Requisito examen) */}
                        <details className="mt-2 text-sm bg-gray-50 p-2 rounded">
                            <summary className="cursor-pointer font-medium text-blue-600">Ver detalles técnicos</summary>
                            <div className="mt-2 space-y-1 text-gray-700">
                                <p><b>Autor:</b> {r.author_name} ({r.author_email})</p>
                                <p><b>Token Expira:</b> {r.token_expiry}</p>
                                <p><b>Coords:</b> {r.coordinates.lat.toFixed(4)}, {r.coordinates.lon.toFixed(4)}</p>
                                {r.image_url && (
                                    <div className="mt-2">
                                        <img src={r.image_url} alt="Evidencia" className="w-full h-40 object-cover rounded" />
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>
                ))}
            </div>
        </div>
    );
}