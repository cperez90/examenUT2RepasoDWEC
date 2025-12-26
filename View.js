export class View {

    constructor() {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.img = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.onload = () => this.resizeImage();
        this.img.src = 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg';
    }

    setImage(url){
        this.img.src=url;
    }

    resizeImage(){
        this.canvas.width=400;
        this.canvas.height=300;

        const w=this.img.width;
        const h=this.img.height;

        const sizer= Math.min(this.canvas.width /w, this.canvas.height/h);
        this.ctx.drawImage(this.img,0,0,w,h,0,0,w*sizer,h*sizer);
    }

    original() {
        this.resizeImage()
    };

    sepia() {
        this.resizeImage()
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i], green = data[i + 1], blue = data[i + 2];

            data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
            data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
            data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    invert() {
        this.resizeImage()
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i]     = 255 - data[i];     // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }
        this.ctx.putImageData(imageData, 0, 0);
    };

    grayscale() {
        this.resizeImage()
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i]     = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }
        this.ctx.putImageData(imageData, 0, 0);
    };

    renderCategories(categories) {
        const filters = document.querySelector('#filters');
        filters.innerHTML = '<li><a href="#">Totes</a>';

        categories.forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#">${cat}</a>`;
            filters.appendChild(li);
        });

        const formSelect = document.querySelector('#form-categoria');
        formSelect.innerHTML = '';
        const allOption = document.createElement('option');
        allOption.value = 'Totes';
        allOption.textContent = 'Totes';
        formSelect.appendChild(allOption);

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            formSelect.appendChild(option);
        });
    }

    renderArtworks(artworks) {
        const container = document.querySelector('#contain');
        container.innerHTML = '';

        artworks.forEach(art => {
            const div = document.createElement('div');
            div.className = 'four columns item';
            div.dataset.category = art.categoria;
            div.innerHTML = `
            <div class="caption">
                <img alt="${art.url}" src="${art.url}" class="pic"
            </div>
            <h4>${art.titol}</h4>
            <p>Publicat el ${art.data}</p>`;

            const btn = document.createElement('button');
            btn.textContent = 'Ver imagen';
            btn.addEventListener('click', () => this.setImage(art.url));
            div.appendChild(btn);
            container.appendChild(div);
        });
    }

    filterArtworks(category) {
        const items = document.querySelectorAll('.gallery .item');

        items.forEach(item => {
            item.style.display = (category === 'Totes' || item.dataset.category === category) ? 'block' : 'none';
        });
    }
}