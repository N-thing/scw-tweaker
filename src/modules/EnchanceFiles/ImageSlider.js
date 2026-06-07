import Button from "../../classes/ui/Button.js";
import Core from "../../core.js";
import icons from "../../icons.js";
import { createElement, log, saveWithName } from "../../utils.js";

class ImageSlider {
    constructor() {
        this.elements = {};
        this.list = [];
        this.isOpen = false;
        this.loaded = 0;

        this.elements.base = createElement('div', 'n0-ef-slider');

        this.elements.content = createElement('div', 'n0-ef-slider-content', this.elements.base);
        this.elements.arrowLeft =  createElement('div', 'n0-ef-slider-arrow n0-ef-slider-arrow-left', this.elements.content, '<');

        this.elements.viewer =  createElement('div', 'n0-ef-slider-viewer', this.elements.content);
        this.elements.header =  createElement('div', 'n0-ef-slider-header', this.elements.viewer);
        this.elements.name =  createElement('div', 'n0-ef-slider-name', this.elements.header);
        this.elements.actions =  createElement('div', 'n0-ef-slider-actions', this.elements.header);
        
        this.btnDownload = new Button(`${icons.download} загрузить`, {size: "NORMAL", state: "READY", style: "BUBBLE"}, async e => {
            this.btnDownload.setState("WAITING");
            let file = this.list[this.current];
            let success = await saveWithName(file.url, file.name);
            if(success) this.btnDownload.setState("READY");
            else this.btnDownload.setState("ERROR");
        }, ['download']);
        this.elements.actions.appendChild(this.btnDownload.getElement());
        
        this.elements.images =  createElement('div', 'n0-ef-slider-images', this.elements.viewer);

        this.elements.arrowRight =  createElement('div', 'n0-ef-slider-arrow n0-ef-slider-arrow-right', this.elements.content, '>');

        this.elements.previews = createElement('div', 'n0-ef-slider-previews', this.elements.base);

        document.body.appendChild(this.elements.base);

        this.elements.base.addEventListener('click', e => {
            if (
                e.target == this.elements.base ||
                e.target == this.elements.content ||
                e.target == this.elements.previews
            ) this.close();
        });

        this.elements.arrowLeft.addEventListener('click', e => {
            if(!this.isOpen) return;
            this.changePrev();
        });

        this.elements.arrowRight.addEventListener('click', e => {
            if(!this.isOpen) return;
            this.changeNext();
        });
        
        window.addEventListener('keydown', e => {
            if(!this.isOpen) return;
            if(e.key === 'ArrowLeft') this.changePrev();
            else if(e.key === 'ArrowRight') this.changeNext();
        });
        
        window.addEventListener('keydown', e => {
            if(!this.isOpen) return;
            if(e.key === 'Escape') this.close();
        });

    }

    getElement() {
        return this.elements.base;
    }

    setList(list, current) {
        this.clear();
        this.list = list;
        this.loaded = 0;

        this.elements.previews.innerHTML = '';
        this.elements.images.innerHTML = '';

        let h = window.innerHeight * 0.84;

        for(let i=0; i<list.length; i++) {

            let image = createElement('img', 'n0-ef-slider-image');
            image.src = list[i].url;
            this.elements.images.appendChild(image);

            image.onload = () => {
                image.style.top = `${(h-image.height) * 0.5}px`;
                this.loaded++;
                if(this.loaded == this.list.length) this.change(current);
            }

            let preview = createElement('div', 'n0-ef-slider-preview');
            this.elements.previews.appendChild(preview);

            let prevImage = createElement('img');
            prevImage.src = list[i].url;
            preview.appendChild(prevImage);

            preview.addEventListener('click', () => {
                this.change(i);
            });
        }
    }

    change(value) {
        let prev = this.current;
        this.current = value;
        
        this.elements.name.innerHTML = `${this.list[value].name}`;

        let ratio = this.elements.images.children[value].width / this.elements.images.children[value].height;
        let width = `${84 * ratio}vh`;
        if(window.innerHeight * 0.84 * ratio > this.elements.images.children[value].width) width = `${this.elements.images.children[value].width}px`;
        this.elements.images.style.width = width;

        for(let i=0; i<this.list.length; i++) {

            let relIndex = Math.min(1, Math.max(-1, i - value));
            if(relIndex < 0) this.elements.images.children[i].style.left = `${this.elements.images.children[i].width * relIndex}px`;
            else this.elements.images.children[i].style.left = `${this.elements.images.children[value].width * relIndex}px`;

            if(i == value) {
                this.elements.previews.children[i].classList.add('current');
                if(this.list[i].element) this.list[i].a.classList.add('n0-ef-lookup');
            } else {
                this.elements.previews.children[i].classList.remove('current');
                if(this.list[i].element) this.list[i].a.classList.remove('n0-ef-lookup');
            }
        }
    }

    open() {
        this.elements.base.classList.add('open');
        this.isOpen = true;
    }

    close() {
        this.clear();
        this.elements.base.classList.remove('open');
        this.isOpen = false;
    }

    clear() {
        for(let i=0; i<this.list.length; i++) {
            if(this.list[i].a) {
                this.list[i].a.classList.remove('n0-ef-lookup');
                this.list[i].a.classList.remove('n0-waiting');
            }
        }
    }

    changeNext() {
        this.current++;
        if(this.current >= this.list.length) this.current = 0;
        this.change(this.current);
    }

    changePrev() {
        this.current--;
        if(this.current < 0) this.current = this.list.length - 1;
        this.change(this.current);
    }
}

export default ImageSlider;