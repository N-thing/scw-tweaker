import { getFileBlob } from "./scw";

export function createElement(type, className, parent, inner) {
    let element = document.createElement(type);
    if(className) element.className = className;
    if(parent) parent.appendChild(element);
    if(inner) element.innerHTML = inner;
    return element;
}

export function getCurrentTicketId() {
    let reg = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    let uuid = window.location.href.match(reg);
    if(uuid != null) return uuid[0];
    return null;
}

export function log(value, type) {
    type = type || '';
    if(type != '') type = `/ ${type} `;
    console.warn(`[ SCW Tweaker ${type}]`, value);
}

export async function saveWithName(url, name) {
    
    let blob = await getFileBlob(url.replace('https://', 'https://n-thing.net/cors/'));
    if(blob != null) url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
}