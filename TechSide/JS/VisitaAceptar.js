//import { response } from "express";
let NombreCliente = document.getElementById("NombreCliente");
let Direccion = document.getElementById("Direccion");
let Colonia = document.getElementById("Colonia");
let Referencia = document.getElementById("Referencia");
let Telefono = document.getElementById("Telefono");
let Visita = document.getElementById("Visita");
let Servicio = document.getElementById("Servicio");
let Estado = document.getElementById("Estado");
const listaServicios = [
  "Instalacion de redes",
  "Servicio de Seguridad",
  "Soporte técnico para software",
];
const star5 = document.getElementById("star5");
const star4 = document.getElementById("star4");
const star3 = document.getElementById("star3");
const star2 = document.getElementById("star2");
const star1 = document.getElementById("star1");
const inform = document.getElementById("inform");
const popup = document.getElementById("popup");
const mostrarifnull = document.getElementById("mostrarifnull");

const ComboServicio = document.getElementById("ServicioSeleccionado");

let VisitaData = {
  VisitaID: null,
};

const URLGetVisitas = "http://localhost:3000/getVisitafromTecnico";
const UserName = localStorage.getItem("UserID");
//console.log(UserName)
addEventListener("DOMContentLoaded", async function () {
  console.log(UserName);

  for (let i = 0; i < listaServicios.length; i++) {
    const option = document.createElement("option");
    option.value = listaServicios[i];
    option.text = listaServicios[i];
    ComboServicio.appendChild(option);
  }

  const res = await fetch(URLGetVisitas, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: {
        Usuario: UserName,
      },
    }),
  })
    .then((res) => res.json())
    .then(function (data) {
      console.log(data.message);
      if (data.message == 0) {
        mostrarifnull.classList.add("open-mostrarifnull");

        inform.classList.add("destroy");
      } else {
        console.log(data);
        console.log(data[0].NombreCliente);

        let fechaString = data[0].FechaVisita;
        const fecha = new Date(fechaString);
        const opciones = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);

        NombreCliente.innerHTML = data[0].NombreCliente;
        Direccion.innerHTML = data[0].Direccion;
        Colonia.innerHTML = data[0].Colonia;
        Referencia.innerHTML = data[0].Referencia;
        Telefono.innerHTML = data[0].Telefono;
        Visita.innerHTML = fechaFormateada;
        Servicio.innerHTML = data[0].Servicio;
        Estado.innerHTML = data[0].Estado;
        VisitaData.VisitaID = data[0].IDVisita;
      }
    });
});

const btnConfirm = document.getElementById("btnConfirm");
btnConfirm.addEventListener("click", function () {
  popup.classList.add("open-popup");
});

const btnEncuesta = document.getElementById("btnEncuesta");
const URLPost = "http://localhost:3000/CompletarVisitaTecnico";

let valor = 10;
star1.addEventListener("change", function () {
  valor = 1;
});
star2.addEventListener("change", function () {
  valor = 2;
});
star3.addEventListener("change", function () {
  valor = 3;
});
star4.addEventListener("change", function () {
  valor = 4;
});
star5.addEventListener("change", function () {
  valor = 5;
});

let ComboValor = "";
const Coment = document.getElementById("Coment");
ComboServicio.addEventListener("change", function () {});

btnEncuesta.addEventListener("click", async function () {
  popup.classList.remove("open-popup");
  Coment.value = "";
  ComboServicio.value = "";
  if (valor == 10) {
    alert("Presione una valoracion");
  } else {
    const res = await fetch(URLPost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parcel: {
          VisitaID: VisitaData.VisitaID,
          Valoracion: valor,
          Comentario: Coment.value,
          Servicio: ComboServicio.value,
        },
      }),
    })
      .then((response) => response.json())
      .then(async function (data) {
        //await delay(3000);
        location.reload();
      });
  }
});
