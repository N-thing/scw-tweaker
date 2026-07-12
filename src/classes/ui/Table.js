import { createElement } from '../../utils';
import UIElement from './UIElement';

export class Table extends UIElement {
    constructor(headers, rows = []) {
        super();
        this.headers = headers;
        this.rows = rows;
    }

    addRow(row) {
        
    }

    createElement() {
        super.createElement();
        this.element = createElement('table', 'n0-table');

        let head = createElement('thead', '', this.element);
        let headtr = createElement('tr', '', head);
        for(const header of this.headers) {
            createElement('td', '', headtr, header);
        }

        let body = createElement('tbody', '', this.element);
        for(const row of this.rows) {
            body.append(row.getElement());
        }

    }
}

export class TableRow extends UIElement {
    constructor(cells = []) {
        super();
        this.cells = cells;
    }

    createElement() {
        super.createElement();
        this.element = createElement('tr');
        for(const cell of this.cells) {
            this.element.append(cell.getElement());
        }
    }
}

export class TableCell extends UIElement {
    constructor(content = "") {
        super();
        this.content = content;
    }

    createElement() {
        super.createElement();
        this.element = createElement('td');

        if(this.content.getElement) this.element.append(this.content.getElement());
        else this.element.append(this.content);
    }
}

export default Table;