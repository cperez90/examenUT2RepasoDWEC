export class Model{

    async fetchCategories() {
        try {
            const res = await fetch('https://theteacher.codiblau.com/public/exercicis/galeria/categories-list');
            return await res.json();
        }catch (err) {
            console.error('Error al cargar categorias:',err);
            return [];
        }
    }

    async fetchArtworks(){
        try {
            const res = await  fetch('https://theteacher.codiblau.com/public/exercicis/galeria/list');
            const data = await res.json();
            return data.sort((a,b) => new Date(a.data) - new Date(b.data));
        }catch (err) {
            console.error('Error al cargar obras:', err);
        }
    }

    async saveArtwork(artwork) {
        try {
            const res = fetch('https://theteacher.codiblau.com/public/exercicis/galeria/save', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(artwork)
            });

            if (!res.ok) {
                new Error(`Error HTTP: ${res.status}`)
            }
            return true;
        }catch (err) {
            console.error('Error al guardar obra:', err);
        }
    }
}