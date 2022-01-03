const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  socket.emit("ultimo-ticket", ticketControl.ultimo);
  socket.emit("estado-actual", ticketControl.ultimos4);
  socket.emit("tickets-pendientes", ticketControl.tickets.length);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);
    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);
  });

  // en el payload viene el objeto de escritorio que mandamos desde el emit
  // y lo destructuramos.
  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es necesario",
      });
    }

    const ticket = ticketControl.atenderTicket(escritorio);

    socket.broadcast.emit("estado-actual", ticketControl.ultimos4);
    socket.emit("tickets-pendientes", ticketControl.tickets.length);
    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);

    if (!ticket) {
      return callback({
        ok: false,
        msg: "No hay tickets disponibles",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = { socketController };
