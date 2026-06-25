import { getFileBlob } from "./scw";

/**
 * @param {string} type 
 * @param {string} className 
 * @param {HTMLElement} parent 
 * @param {string} inner 
 * @returns {HTMLElement}
 */
export function createElement(type, className, parent, inner) {
    let element = document.createElement(type);
    if(className) element.className = className;
    if(parent) parent.appendChild(element);
    if(inner) element.innerHTML = inner;
    return element;
}

/**
 * @returns {string}
 */
export function getUuidFromUrl(index = 0) {
    let reg = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
    let uuid = [...window.location.href.matchAll(reg)];
    if(uuid != null) {
        if(uuid[index]) return uuid[index][0]
        else return null;
    }
    return null;
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} prefix
 */
export function removeClassByPrefix(element, prefix) {
    const toRemove = Array.from(element.classList).filter(className => 
        className.startsWith(prefix)
    );
    if (toRemove.length > 0) element.classList.remove(...toRemove);
};

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} prefix
 * @param {string} value
 */
export function switchClassWithPrefix(element, prefix, value) {
    removeClassByPrefix(element, prefix);
    if(value != null) element.classList.add(`${prefix}${value.toLowerCase()}`);
};


export function log(value, type) {
    type = type || '';
    if(type != '') type = `/ ${type} `;
    console.warn(`[ SCW Tweaker ${type}]`, value);
}

/** @param {HTMLElement} element */
export function resetAnimation(element) {
    void element.offsetWidth;
}

export async function openFile(fileData) {
    let url = fileData.url;
    let blob = await getFileBlob(getAnyCors(url));

    if(blob != null) {
        const namedFile = new File([blob], fileData.name, { type: fileData.mimeType });
        url = URL.createObjectURL(namedFile);
    } 

    window.open(url, "_blank");
    return true;
}

export async function saveWithName(fileData) {
    const {name} = fileData;
    let url = await fileData.getBlobUrl();

    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    return true;
}

/**
 * 
 * @param {HTMLElement} element
 * @returns {Boolean}
 */
export function elementExist(element) {
    return (element || document.body.contains(element))
}

export function getAnyCors(url) {
    return url.replace('https://', 'https://n-thing.net/cors/');
}

export function loadImageAsync(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Не удалось загрузить пикчу: ${url}`));
        
        img.src = url;
    });
}

export function loadVideoMetaAsync(url) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        
        video.onloadedmetadata = () => resolve(video);
        video.onerror = () => reject(new Error(`Не удалось загрузить видос: ${url}`));
        
        video.src = url;
    });
}

export async function getVideoFirstFrame(url) {

    return new Promise(async (resolve, reject) => {
        const video = document.createElement('video');
        video.src = url;
        // video.crossOrigin = 'anonymous'; // Предотвращает ошибку CORS при сохранении
        video.muted = true;             
        video.playsInline = true;

        video.addEventListener('loadeddata', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64Image = canvas.toDataURL('image/jpeg');
            resolve(base64Image);
        });

        video.addEventListener('error', (e) => reject(new Error(`Не удалось загрузить видос: ${e}`)));
    });
    
}