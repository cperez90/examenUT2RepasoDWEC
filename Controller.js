import {Model} from "./Model.js";
import {View} from "./View.js";

export class Controller {

    constructor() {
        this.model = new Model();
        this.view = new View();
    }

    async init() {

        const categories = await this.model.fetchCategories();
        this.view.renderCategories(categories);

        document.querySelectorAll('#filters li a').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                this.view.filterArtworks(link.textContent);
            });
        });

        const formSelect = document.querySelector('#form-categoria');
        formSelect.addEventListener('change', () => {
            this.view.filterArtworks(formSelect.value);
        });

        const artworks = await this.model.fetchArtworks();
        this.view.renderArtworks(artworks);

        const radios = [
            {id:'#original',fn: this.view.original.bind(this.view)},
            {id:'#grayscale',fn: this.view.grayscale.bind(this.view)},
            {id:'#inverted',fn: this.view.invert.bind(this.view)},
            {id:'#sepia',fn: this.view.sepia.bind(this.view)}
        ];

        radios.forEach(r => {
            document.querySelector(r.id).addEventListener('change',r.fn);
        });

        document.querySelector('#form-send').addEventListener('click', async e => {
            e.preventDefault();
            const titol = document.querySelector('#form-titol').value;
            const url = document.querySelector('#form-url').value;
            const data = document.querySelector('#form-data').value;
            const categoria = document.querySelector('#form-categoria').value;

            if (!url.match(/\.(jpg|png|jpeg)$/i)){
                alert('Solo se aceptan jp,png,jpeg');
                return;
            }

            await this.model.saveArtwork({titol,url,data,categoria});
            const artworks = await this.model.fetchArtworks();
            this.view.renderArtworks(artworks);
        })
    }
}