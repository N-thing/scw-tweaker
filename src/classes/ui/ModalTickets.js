import { createElement, log } from "../../utils";
import Modal from "./Modal";
import Table, { TableCell, TableRow } from "./Table";

class ModalTickets extends Modal {
    constructor(tickets) {
        super();
        this.tickets = tickets;

        this.header.setText("Заявки", "LEFT");

        let headers = ['номер', 'создана', 'тип', 'статус', 'исполнитель'];
        let rows = [];

        for(const ticket of tickets) {

            let number = createElement('a', 'n0-ticket-number', null, ticket.number);
            number.href = `https://z.service-company.biz/#/home/tickets/view/${ticket.id}`;
            number.target = "_blank";

            let date = new Date(ticket.created_at * 1000);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            date = `${day}.${month}.${year}`; 

            let stage = createElement('span', `n0-ticket-stage stage-${ticket.ticket_stage.data.code}`, null, ticket.ticket_stage.data.name);
            stage.style.setProperty("--stage-color", ticket.ticket_stage.data.color);

            let rowCells = [];
            rowCells.push(new TableCell(number));
            rowCells.push(new TableCell(date));
            rowCells.push(new TableCell(ticket.title));
            rowCells.push(new TableCell(stage));
            rowCells.push(new TableCell(ticket.getExecutorName()));

            let row = new TableRow(rowCells);

            rows.push(row);
        }

        this.table = new Table(headers, rows);
        this.table.getElement().classList.add('table-tickets');

        this.content.addElement(this.table, "CENTER");

        this.getElement().classList.add('n0-tickets');

    }

}

export default ModalTickets;