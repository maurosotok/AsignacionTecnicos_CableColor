let currentPage = 1;
let columnSelected = null;
let flagfilter = false;
const ComboStatus = document.getElementById("StatusDropdown");
const tabla = document.getElementById("tableVista");
const ComboStatusFilter = document.getElementById("StatusDropdownFilter");

const rows = tabla.getElementsByTagName("tr");
const getVisitasUrl = `http://localhost:3000/VistaVisitas?page=${currentPage}&limit=10`;
//let estadosCombo = ["Completado", "Pendiente", "Descartada"];
const ComboColonia = document.getElementById("options");
let popup1 = document.getElementById("mostrarEditar1");
let popup = document.getElementById("mostrarEditar");
let popEditar = document.getElementById("popup");
const inputDireccion = document.getElementById("inputDireccion");
const inputColonia = document.getElementById("inputColonia");
//const inputServicio = document.getElementById("inputServicio");
const inputDia = document.getElementById("inputDia");
const inputMes = document.getElementById("inputMes");
const inputAño = document.getElementById("inputAño");
const inputTecnico = document.getElementById("inputTecnico");
let estadosCombo = ["Completado", "Pendiente", "Descartada"];
let servicios = [
  "Cambio de equipo",
  "Instalacion",
  "Mantenimiento",
  "Reparación",
];
let estados = ["Completado", "Descartada"];
let Fecha = [];
let DatosVisita = {
  ID: null,
  NombreCliente: null,
  Direccion: null,
  Colonia: null,
  Servicio: null,
  Fecha: null,
  NombreTecnico: null,
  IDTecnico: null,
  Estado: null,
  ClienteID: null,
};
const getURLTecnicos = "http://localhost:3000/gettecnicosDisponiblesCombo";
const ComboTecnico = document.getElementById("TechDropdown");
let selectedTech = null;
let tecnicos = [];

ComboTecnico.addEventListener("change", function () {
  selectedTech = this.value;
  console.log(tecnicos);
  for (let j = 0; j < tecnicos.length; j++) {
    if (tecnicos[j].NombreTec == selectedTech) {
      DatosVisita.IDTecnico = tecnicos[j].TecnicoID;
      DatosVisita.NombreTecnico = tecnicos[j].NombreTec;
    }
  }
  console.log(DatosVisita.IDTecnico);
});
let flagcombo = false;
const ComboServicio = document.getElementById("ServiceDropdown");
const getColonias = "http://localhost:3000/getColonias";
let comboestado = "";
const URLFilterName1 = `http://localhost:3000/getFilterEstadoInVisita?page=${currentPage}&limit=10`;
ComboStatusFilter.addEventListener("change", function () {
  flagcombo = true;
  comboestado = this.value;
  currentPage = 1;

  let valor = this.value.trim().toLowerCase();

  procesofiltro(URLFilterName1, valor);
});

addEventListener("DOMContentLoaded", async function () {
  flagcombo = true
  for (let i = 0; i < estados.length; i++) {
    const option = document.createElement("option");
    option.value = estados[i];
    option.text = estados[i];
    ComboStatus.appendChild(option);
  }
  for (let i = 0; i < servicios.length; i++) {
    const option = document.createElement("option");
    option.value = servicios[i];
    option.text = servicios[i];
    ComboServicio.appendChild(option);
  }

  for (let i = 0; i < estadosCombo.length; i++) {
    const option = document.createElement("option");
    option.value = estadosCombo[i];
    option.text = estadosCombo[i];
    ComboStatusFilter.appendChild(option);
  }
  const response = await fetch(getColonias, {
    method: "GET",
  });
  colonias = await response.json();

  for (let i = 0; i < colonias.length; i++) {
    const option = document.createElement("option");
    //console.log(colonias[i].NombreColonia)
    option.value = colonias[i].NombreColonia;
    option.text = colonias[i].NombreColonia;

    ComboColonia.appendChild(option);
  }

  const resp = await fetch(getURLTecnicos, {
    method: "GET",
  });
  tecnicos = await resp.json();

  for (let i = 0; i < tecnicos.length; i++) {
    const option = document.createElement("option");
    option.value = tecnicos[i].NombreTec;
    option.text = tecnicos[i].NombreTec;
    ComboTecnico.appendChild(option);
  }
  comboestado = "Pendiente";
  const URLFilterName1 = `http://localhost:3000/getFilterEstadoInVisita?page=${currentPage}&limit=10`;
  procesofiltro(URLFilterName1, comboestado);
});

popEditar.addEventListener("click", function () {
  popEditar.classList.remove("open-popup");
  location.reload();
});

document.getElementById("btnReset").addEventListener("click", () => {
  location.reload();
});

const UpdateURL = "http://localhost:3000/ActualizarVisita";

document.getElementById("btnEditar").addEventListener("click", async () => {
  try {
    let valorCombo = 1;
    if (ComboStatus.selectedIndex == 0) {
      valorCombo = DatosVisita.Estado;
      console.log(DatosVisita.Estado);
    } else {
      valorCombo = ComboStatus.value;
    }

    let ValorServicio = 1;
    if (ComboServicio.selectedIndex == 0) {
      ValorServicio = DatosVisita.Servicio;
      console.log(DatosVisita.Estado);
    } else {
      ValorServicio = ComboServicio.value;
    }

    let ValorColonia = 1;
    if (ComboColonia.selectedIndex == 0) {
      ValorColonia = DatosVisita.Colonia;
    } else {
      ValorColonia = ComboColonia.value;
    }

    const date = new Date();
    day = date.getDate();
    month = 4;
    console.log(day);

    if (
      inputMes.value == "--" ||
      inputDia.value == "--" ||
      inputAño.value == ""
    ) {
      alert("Por favor llene todos los campos");
    } else if (inputAño.value > 2025 || inputAño.value < 2023) {
      alert("Ingrese un año valido");
    } else if (inputMes.value > 12) {
      alert("Ingrese un mes valido");
    } else if (inputDia.value > 31) {
      alert("Ingrese un dia valido");
    } else if (
      (inputMes.value == 4 ||
        inputMes.value == 6 ||
        inputMes.value == 9 ||
        inputMes.value == 11) &&
      inputDia.value == 31
    ) {
      alert("Este mes no tiene 31 dias");
    } else if (inputMes.value == 2 && inputDia.value > 29) {
      alert("Este mes no tiene mas de 29 dias");
    } else if (inputDia.value < day && inputMes.value == month) {
      alert("Ingrese un dia valido");
    } else if (inputMes.value < month) {
      alert("Ingrese un mes valido");
    } else if (DatosVisita.Estado.trim() == "Completado") {

        alert("No se puede modificar una visita completada!");
    } else if (ComboStatus.selectedIndex != 0 && DatosVisita.Estado.trim() == "Completado") {
      alert("No puede modificar una visita completada!! ");
    } else {
      const res = await fetch(UpdateURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parcel: {
            ID: DatosVisita.ID,
            Direccion: inputDireccion.value,
            Colonia: ValorColonia.trim(),
            Servicio: ValorServicio.trim(),
            NombreTecnico: DatosVisita.NombreTecnico,
            IDTecnico: DatosVisita.IDTecnico,
            Dia: inputDia.value,
            Mes: inputMes.value,
            Year: inputAño.value,
            Estado: valorCombo.trim(),
          },
        }),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (datos) {
          let placeSelected = document.querySelector("#data-output");
          let fromSelectedRow = "";

          for (let product of datos) {
            let fechaString = product.FechaVisita;
            const fecha = new Date(fechaString);
            const opciones = {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            };
            const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
            fromSelectedRow += `
                 <tr>
                    <td>${product.IDVisita} </td>   
                    <td>${product.ClienteID} </td>
                    <td>${product.NombreCliente} </td>
                    <td>${product.Direccion} </td>
                    <td>${product.Colonia} </td>
                    <td>${product.Servicio} </td>
                    <td id="date">${fechaFormateada}</td>
                    <td>${product.NombreTec} </td>
                    <td>${product.Estado} </td>
                </tr>
            `;
          }
          placeSelected.innerHTML = fromSelectedRow;
          popEditar.classList.add("open-popup");
        });
    }
  } catch (error) {
    alert("Hubo un error, intente de nuevo, VISITA ID: ", DatosVisita.ID);
  }
});

btnNext.addEventListener("click", () => {
  if (flagfilter == true) {
    console.log(currentPage);
    sortTable(columnSelected);
  } else if (flagcombo == true) {
    currentPage = currentPage + 1;
    const URLFilterName1 = `http://localhost:3000/getFilterEstadoInVisita?page=${currentPage}&limit=10`;
    procesofiltro(URLFilterName1, comboestado);
  } else {
    currentPage = currentPage + 1;
    getVisitasUrl1 = `http://localhost:3000/VistaVisitas?page=${currentPage}&limit=10`;
    fetch(getVisitasUrl1)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#data-output");
        let out = "";
        console.log(vista);
        for (let product of vista.results) {
          let fechaString = product.FechaVisita;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
          out += `
                   <tr>
                      <td>${product.IDVisita} </td>  
                      <td>${product.Clienteid} </td> 
                      <td>${product.NombreCliente} </td>
                      <td>${product.Direccion} </td>
                      <td>${product.Colonia} </td>
                      <td>${product.Servicio} </td>
                      <td id="date">${fechaFormateada}</td>
                      <td>${product.NombreTec} </td>
                      <td>${product.Estado} </td>
                  </tr>
              `;
        }
        placeholder.innerHTML = out;
        process();
      });
  }
});

btnPrev.addEventListener("click", () => {
  if (currentPage == 1) {
  } else if (flagcombo == true) {
    currentPage = currentPage - 1;
    const URLFilterName1 = `http://localhost:3000/getFilterEstadoInVisita?page=${currentPage}&limit=10`;
    procesofiltro(URLFilterName1, comboestado);
  } else if (flagfilter == true) {
    currentPage = currentPage - 1;
    let getVisitasUrl2 = `http://localhost:3000/VistaVisitas?page=${currentPage}&limit=10`;
    sortTable(columnSelected);

    procesofiltro(getVisitasUrl2, comboestado);
  } else {
    currentPage = currentPage - 1;
    let getVisitasUrl2 = `http://localhost:3000/VistaVisitas?page=${currentPage}&limit=10`;
    fetch(getVisitasUrl2)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#data-output");
        let out = "";
        console.log(vista);
        for (let product of vista.results) {
          let fechaString = product.FechaVisita;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
          out += `
                   <tr>
                      <td>${product.IDVisita} </td>   
                      <td>${product.Clienteid} </td>
                      <td>${product.NombreCliente} </td>
                      <td>${product.Direccion} </td>
                      <td>${product.Colonia} </td>
                      <td>${product.Servicio} </td>
                      <td id="date">${fechaFormateada}</td>
                      <td>${product.NombreTec} </td>
                      <td>${product.Estado} </td>
                  </tr>
              `;
        }
        placeholder.innerHTML = out;
        process();
      });
  }
});

async function process() {
  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener("click", async function () {
      const cells = this.getElementsByTagName("td");
      DatosVisita.ID = cells[0].innerHTML;
      DatosVisita.ClienteID = cells[1].innerHTML;
      DatosVisita.NombreCliente = cells[2].innerHTML;
      DatosVisita.Direccion = cells[3].innerHTML;
      DatosVisita.Colonia = cells[4].innerHTML.trim();
      DatosVisita.Servicio = cells[5].innerHTML;
      DatosVisita.Fecha = cells[6].innerHTML;
      DatosVisita.NombreTecnico = cells[7].innerHTML;
      DatosVisita.Estado = cells[8].innerHTML;
      const postURL = "http://localhost:3000/VisitaSeleccionada";
      const res = await fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parcel: {
            ID: DatosVisita.ID,
          },
        }),
      })
        .then((response) => response.json())
        .then(function (data2) {
          let place = document.querySelector("#data-output");
          let fromSelectedRow = "";
          for (let product of data2) {
            let fechaString = product.FechaVisita;
            const fecha = new Date(fechaString);
            const opciones = {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            };
            const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
            fromSelectedRow += `
             <tr>
                <td>${product.IDVisita} </td>   
                <td>${product.ClienteID} </td>
                <td>${product.NombreCliente} </td>
                <td>${product.Direccion} </td>
                <td>${product.Colonia} </td>
                <td>${product.Servicio} </td>
                <td id="date">${fechaFormateada}</td>
                <td>${product.NombreTec} </td>
                <td>${product.Estado} </td>
            </tr>
        `;
          }
          place.innerHTML = fromSelectedRow;
          popup.classList.add("mostrarEditar-popup");
          popup1.classList.add("mostrarEditar-popup");

          Fecha = DatosVisita.Fecha.split("/");

          inputDireccion.value = DatosVisita.Direccion.trim();
          // inputColonia.value = DatosVisita.Colonia.trim();
          //inputServicio.value = DatosVisita.Servicio.trim();

          inputDia.value = Fecha[0];
          inputMes.value = Fecha[1];
          inputAño.value = Fecha[2];
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }
}

async function sortTable(columnIndex) {
  flagfilter = true;
  columnSelected = columnIndex;
  //currentPage = 1;
  const orderbyTecnicoURL = `http://localhost:3000/orderbyVista?page=${currentPage}&limit=10`;
  const res = await fetch(orderbyTecnicoURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: {
        Columna: columnIndex,
      },
    }),
  })
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      let placeholder = document.querySelector("#data-output");
      let out = "";
      for (let product of data.results) {
        let fechaString = product.FechaVisita;
        const fecha = new Date(fechaString);
        const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
        const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
        out += `
                 <tr>
                    <td>${product.IDVisita} </td>   
                    <td>${product.ClienteID} </td>
                    <td>${product.NombreCliente} </td>
                    <td>${product.Direccion} </td>
                    <td>${product.Colonia} </td>
                    <td>${product.Servicio} </td>
                    <td id="date">${fechaFormateada}</td>
                    <td>${product.NombreTec} </td>
                    <td>${product.Estado} </td>
                </tr>
            `;
      }
      placeholder.innerHTML = out;
      process();
    });
}

const inputFiltro = document.getElementById("inputFiltro");
inputFiltro.addEventListener("input", async function () {
  try {
    currentPage = 1;
    const URLFilterName1 = `http://localhost:3000/getFilterNameInVisita?page=${currentPage}&limit=10`;
    let valor = this.value.trim().toLowerCase();
    procesofiltro(URLFilterName1, valor);
  } catch (error) {
    let fromSelectedRow = "";
    let place = document.querySelector("#data-output");
    fromSelectedRow += `<tr class="row">
            
          </tr>`;
    place.innerHTML = fromSelectedRow;
  }
});

const inputFiltroColonia = document.getElementById("inputFiltroColonia");

inputFiltroColonia.addEventListener("input", async function () {
  try {
    currentPage = 1;
    const URLFilterName1 = `http://localhost:3000/getFilterColoniaInVisita?page=${currentPage}&limit=10`;
    let valor = this.value.trim().toLowerCase();
    procesofiltro(URLFilterName1, valor);
  } catch (error) {
    let fromSelectedRow = "";
    let place = document.querySelector("#data-output");
    fromSelectedRow += `<tr class="row">
              
            </tr>`;
    place.innerHTML = fromSelectedRow;
  }
});

const inputFiltroServicio = document.getElementById("inputFiltroServicio");
inputFiltroServicio.addEventListener("input", async function () {
  try {
    currentPage = 1;
    const URLFilterName1 = `http://localhost:3000/getFilterServicioInVisita?page=${currentPage}&limit=10`;
    let valor = this.value.trim().toLowerCase();
    procesofiltro(URLFilterName1, valor);
  } catch (error) {
    let fromSelectedRow = "";
    let place = document.querySelector("#data-output");
    fromSelectedRow += `<tr class="row">
              
            </tr>`;
    place.innerHTML = fromSelectedRow;
  }
});

const inputFiltroTecnico = document.getElementById("inputFiltroTecnico");
inputFiltroTecnico.addEventListener("input", async function () {
  try {
    currentPage = 1;
    const URLFilterName1 = `http://localhost:3000/getFilterTechInVisita?page=${currentPage}&limit=10`;
    let valor = this.value.trim().toLowerCase();
    procesofiltro(URLFilterName1, valor);
  } catch (error) {
    let fromSelectedRow = "";
    let place = document.querySelector("#data-output");
    fromSelectedRow += `<tr class="row">
              
            </tr>`;
    place.innerHTML = fromSelectedRow;
  }
});

async function procesofiltro(URL, DatoIngresado) {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parcel: {
          Nombre: DatoIngresado,
        },
      }),
    })
      .then((res) => res.json())
      .then(function (data) {
        let place = document.querySelector("#data-output");
        let fromSelectedRow = "";
        for (let product of data.results) {
          let fechaString = product.FechaVisita;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
          fromSelectedRow += `
              <tr>
                <td>${product.IDVisita} </td>   
                <td>${product.ClienteID} </td>
                <td>${product.NombreCliente} </td>
                <td>${product.Direccion} </td>
                <td>${product.Colonia} </td>
                <td>${product.Servicio} </td>
                <td id="date">${fechaFormateada}</td>
                <td>${product.NombreTec} </td>
                <td>${product.Estado} </td>
              </tr>
            `;
        }
        place.innerHTML = fromSelectedRow;
        process();
      });
  } catch (error) {
    let fromSelectedRow = "";
    let place = document.querySelector("#data-output");
    fromSelectedRow += `<tr class="row">
              
            </tr>`;
    place.innerHTML = fromSelectedRow;
  }
}
