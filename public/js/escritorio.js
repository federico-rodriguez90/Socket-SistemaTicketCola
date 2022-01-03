// Referencias HTML
const lblEscritorio = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblAtendiendo = document.querySelector("small");
const divAlerta = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es necesario");
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerHTML = escritorio;

divAlerta.style.display = "none";

const socket = io();

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  btnAtender.disabled = true;
});

socket.on("tickets-pendientes", (pendientes) => {
  if (pendientes === 0) {
    divAlerta.style.display = "";
    lblPendientes.style.display = "none";
  } else {
    lblPendientes.style.display = "";
    divAlerta.style.display = "none";
    lblPendientes.innerText = pendientes;
  }
});

btnAtender.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, ({ ok, ticket }) => {
    if (!ok) {
      lblAtendiendo.innerHTML = "Nadie";
      return (divAlerta.style.display = "");
    }

    lblAtendiendo.innerHTML = `Ticket ${ticket.numero}`;
  });
});
