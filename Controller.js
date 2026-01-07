import {Model} from "./Model.js";
import {View} from "./View.js";

export class Controller {

    constructor() {
        this.model = new Model();
        this.view = new View();
    }

    artworks = [];
    currentPage = 1;

    paginacion(){
        const paginacion = document.querySelector('.paginacio');
        const pageSize = parseInt(document.querySelector('#paginacio-number')?.value, 10);
        if (pageSize === -1) {
            pag.innerHTML = "";          // o pag.style.display = "none";
            this.currentPage = 1;
            this.view.renderArtworks(this.renderPage().pageData);
            return;
        }

        const {totalPages} = this.renderPage();
        paginacion.innerHTML="";
        const prev = document.createElement('a');
        prev.href = "#";
        prev.innerHTML= '<<';
        prev.addEventListener('click',(e)=>{
            e.preventDefault();
            if (this.currentPage > 1){
                this.currentPage--;
                this.view.renderArtworks(this.renderPage().pageData);
                this.paginacion();
            }
        });
        const next = document.createElement('a');
        next.href = "#";
        next.innerHTML= '>>';
        next.addEventListener('click',(e)=>{
            e.preventDefault()
            if (this.currentPage < totalPages){
                this.currentPage++;
                this.view.renderArtworks(this.renderPage().pageData);
                this.paginacion();
            }
        });

        paginacion.appendChild(prev);

        for(let i = 1; i<totalPages; i++){
            const pagesNumber = document.createElement('a');
            pagesNumber.href="#"
            pagesNumber.innerHTML=i.toString();
            if (i === this.currentPage) pagesNumber.classList.add('active');
            pagesNumber.addEventListener('click',(e)=>{
                e.preventDefault();
                this.currentPage = i;
                this.view.renderArtworks(this.renderPage().pageData);
                this.paginacion();
            })
            paginacion.appendChild(pagesNumber);
        }

        paginacion.appendChild(next);

    }

    renderPage(){
        const images = this.artworks;
        let pageSizeRaw = document.querySelector('#paginacio-number')?.value;
        const pageSize = Math.max(1, parseInt(pageSizeRaw, 10) || 6);
        if (pageSize === -1) {
            this.currentPage = 1;
            return {
                totalPages: 1,
                pageData: images.slice(),
                pageSize: images.length || 1
            };
        }

        const finalPageSize = pageSize > 0 ? pageSize : 6;

        const totalPages = Math.max(1, Math.ceil(images.length / finalPageSize));
        this.currentPage = Math.min(Math.max(1, this.currentPage), totalPages);

        const start = (this.currentPage - 1) * finalPageSize;
        const pageData = images.slice(start, start + finalPageSize);

        return { totalPages, pageData, pageSize: finalPageSize };
    }

    async init() {

        document.querySelector('#paginacio-number')?.addEventListener('change', () => {
            this.currentPage = 1;
            this.view.renderArtworks(this.renderPage().pageData);
            this.paginacion();
        });

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

        this.artworks = await this.model.fetchArtworks();
        this.currentPage = 1;

        this.view.renderArtworks(this.renderPage().pageData);
        this.paginacion();


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
            this.artworks = await this.model.fetchArtworks();

            this.currentPage = 1;
            this.view.renderArtworks(this.renderPage().pageData);
            this.paginacion();
        })
    }

}