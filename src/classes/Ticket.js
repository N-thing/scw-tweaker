class Ticket {
    constructor(data) {
        for (const key of Object.keys(data)) {
            this[key] = data[key];
        }
    }
}

export default Ticket;