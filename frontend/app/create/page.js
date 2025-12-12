'use client';
import { useState } from 'react';
import { useSession } from "next-auth/react";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateReview() {
    const { data: session } = useSession();
    const router = useRouter();
    const [form, setForm] = useState({ place_name: '', address: '', rating: 5 });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let imageUrl = "";

        // 1. Subir imagen a Cloudinary (si existe)
        if (image) {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
            
            try {
                const cloudRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    formData
                );
                imageUrl = cloudRes.data.secure_url;
            } catch (err) {
                alert("Error subiendo imagen");
                setLoading(false);
                return;
            }
        }

        // 2. Preparar datos para el Backend
        const payload = {
    ...form,
    image_url: imageUrl,
    author_name: session?.user?.name,
    author_email: session?.user?.email,
    
    // CORRECCIÓN PARA CUMPLIR REQUISITO DE "TIMESTAMPS" [cite: 31]
    token_expiry: session?.expires, // Fecha caducidad
    token_issued: new Date().toISOString() // Fecha emisión (Simulada con hora actual)
};

        // 3. Enviar al Backend
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, payload);
            router.push('/'); // Volver al inicio
        } catch (error) {
            console.error(error);
            alert("Error al guardar la reseña");
        } finally {
            setLoading(false);
        }
    };

    if (!session) return <p className="text-center mt-10">Cargando sesión...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-black">
            <h1 className="text-2xl font-bold mb-4">Nueva Reseña</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <label className="font-semibold">Nombre del lugar</label>
                <input required className="border p-2 rounded" 
                    onChange={e => setForm({...form, place_name: e.target.value})} />

                <label className="font-semibold">Dirección Postal</label>
                <input required className="border p-2 rounded" placeholder="Ej: Calle Larios, Málaga"
                    onChange={e => setForm({...form, address: e.target.value})} />

                <label className="font-semibold">Valoración (0-5)</label>
                <input type="number" min="0" max="5" required className="border p-2 rounded"
                    value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})} />

                <label className="font-semibold">Foto (Opcional)</label>
                <input type="file" onChange={e => setImage(e.target.files[0])} />

                <button disabled={loading} className="bg-blue-600 text-white p-3 rounded mt-2 hover:bg-blue-700">
                    {loading ? 'Subiendo...' : 'Publicar Reseña'}
                </button>
                
                <button type="button" onClick={() => router.back()} className="text-gray-500 text-sm underline">
                    Cancelar
                </button>
            </form>
        </div>
    );
}