// cuando haga click en el cliente, se reduza a una sola fila y aparezcan las opciones para editar, o hacer la table editable
//cambiar combo solo si es notificado, de activvo, inactivo etc
let currentPage = 1;
let flagfilter = false;
let flagchange = false;
let columnSelected = null;
let getVisitasUrl = `http://localhost:3000/clientes?page=${currentPage}&limit=10`;
const tabla = document.getElementById("table");
const rows = tabla.getElementsByTagName("tr");
const ComboColonia = document.getElementById("options");
const postURL = "http://localhost:3000/ClienteSeleccionado";
const btnEditar = document.getElementById("Actualizar");
const updateURL = "http://localhost:3000/ActualizarCliente/";
let inputNombre = document.getElementById("LbNombre");
let inputDireccion = document.getElementById("LbDireccion");
//let inputColonia = document.getElementById("LbColonia");
let inputReferencia = document.getElementById("LbReferencia");
let inputTelefono = document.getElementById("LbTelefono");
let inputIdentidad = document.getElementById("LbIdentidad");
let inputEstado = document.getElementById("LbEstado");
let popup = document.getElementById("mostrarEditar");

let popConfirmation = document.getElementById("popup");
let estados = ["Activo", "Inactivo"];
const ComboStatus = document.getElementById("StatusDropdown");

document.getElementById("ResetButton").addEventListener("click", () => {
  location.reload();
});

let DatosCliente = {
  ID: null,
  Nombre: null,
  Direccion: null,
  Colonia: null,
  Referencia: null,
  Telefono: null,
  Identidad: null,
  Estado: null,
};

popup.addEventListener("click", function () {
  popup.classList.remove("open-popup");
  //location.reload();
});
const getColonias = "http://localhost:3000/getColonias";
addEventListener("DOMContentLoaded", async function () {
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

  fetch(getVisitasUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (vista) {
      let placeholder = document.querySelector("#data-output");
      let out = "";
      for (let product of vista.results) {
        out += `
            <tr class="row">
                <td>${product.ClienteID} </td>
                <td>${product.Nombre} </td>
                <td>${product.Direccion} </td>
                <td>${product.Colonia} </td>
                <td>${product.Referencia} </td>
                <td>${product.Telefono} </td>
                <td>${product.Identidad} </td>
                <td>${product.Estado} </td>
            </tr>
        `;
      }
      placeholder.innerHTML = out;
      process();
    });
});

const btnNext = document.getElementById("btnNext");

btnNext.addEventListener("click", async () => {
  if (flagfilter == true) {
    currentPage = currentPage + 1;
    sortTable(columnSelected);
    process();
  } else {
    currentPage = currentPage + 1;
    getVisitasUrl = `http://localhost:3000/clientes?page=${currentPage}&limit=10`;
    fetch(getVisitasUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#data-output");
        let out = "";

        for (let product of vista.results) {
          out += `
          <tr>
              <td>${product.ClienteID} </td>  
              <td>${product.Nombre} </td>
              <td>${product.Direccion} </td>
              <td>${product.Colonia} </td>
              <td>${product.Referencia} </td>
              <td>${product.Telefono} </td>
              <td>${product.Identidad} </td>
              <td>${product.Estado} </td>
          </tr>
      `;
        }
        placeholder.innerHTML = out;
        process();
      });
  }
});

ComboStatus.addEventListener("change", function () {
  flagchange = true;
});

const btnPrev = document.getElementById("btnPrev");

btnPrev.addEventListener("click", async () => {
  if (currentPage == 1) {
  } else if (flagfilter == true) {
    currentPage = currentPage - 1;
    sortTable(columnSelected);
  } else {
    currentPage = currentPage - 1;
    getVisitasUrl = `http://localhost:3000/clientes?page=${currentPage}&limit=10`;
    fetch(getVisitasUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#data-output");
        let out = "";

        for (let product of vista.results) {
          out += `
          <tr>
              <td>${product.ClienteID} </td>  
              <td>${product.Nombre} </td>
              <td>${product.Direccion} </td>
              <td>${product.Colonia} </td>
              <td>${product.Referencia} </td>
              <td>${product.Telefono} </td>
              <td>${product.Identidad} </td>
              <td>${product.Estado} </td>
          </tr>
      `;
        }
        placeholder.innerHTML = out;
        process();
      });
  }
});

btnEditar.addEventListener("click", async (event) => {
  event.preventDefault();
  let valorCombo = 1;
  if (ComboStatus.selectedIndex == 0) {
    valorCombo = DatosCliente.Estado;
  } else {
    valorCombo = ComboStatus.value;
  }

  let ValorColonia = 1;
  if (ComboColonia.selectedIndex == 0) {
    ValorColonia = DatosCliente.Colonia;
  } else {
    ValorColonia = ComboColonia.value;
  }
  const regex = /\d/; // The \d represents any digit
  if (
    inputNombre.value == "" ||
    inputDireccion.value == "" ||
    inputReferencia.value == "" ||
    inputDireccion.value == "" ||
    inputIdentidad.value == ""
  ) {
    alert("Por favor llene todos los campos");
  } else if (inputNombre.value.length < 8) {
    alert("Ingresa un nombre mas largo");
  } else if (inputDireccion.value.length < 8) {
    alert("Ingresa una direccion mas larga");
  } else if (inputReferencia.value.length < 8) {
    alert("Ingresa una referencia mas larga");
  } else if (inputTelefono.value.length < 8) {
    alert("Ingresa un numero de telefono mas largo");
  } else if (inputIdentidad.value.length < 8) {
    alert("Ingresa una identidad mas largo");
  } else if (regex.test(inputNombre.value) == true) {
    alert("No se permiten numeros en el nombre");
  }  else {
    const res = await fetch(updateURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parcel: {
          ID: DatosCliente.ID.trim(),
          Nombre: inputNombre.value.trim(),
          Direccion: inputDireccion.value.trim(),
          Colonia: ValorColonia.trim(),
          Referencia: inputReferencia.value.trim(),
          Telefono: inputTelefono.value.trim(),
          Identidad: inputIdentidad.value.trim(),
          Estado: valorCombo.trim(),
          Confirmacion: flagchange,
        },
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (datos) {
        let placeSelected = document.querySelector("#data-output");
        let fromSelectedRow = "";
        for (let producto of datos) {
          fromSelectedRow += `<tr class="row">
            <td>${producto.ClienteID} </td>
            <td>${producto.Nombre} </td>
            <td>${producto.Direccion} </td>
            <td>${producto.Colonia} </td>
            <td>${producto.Referencia} </td>
            <td>${producto.Telefono} </td>
            <td>${producto.Identidad} </td>
            <td>${producto.Estado} </td>
        </tr>`;
        }
        placeSelected.innerHTML = fromSelectedRow;
        popConfirmation.classList.add("open-popup");
      });
    if (res.ok) {
      console.log("logrado");
    }
  }
});

addEventListener("DOMContentLoaded", function () {
  for (let i = 0; i < estados.length; i++) {
    const option = document.createElement("option");
    option.value = estados[i];
    option.text = estados[i];
    ComboStatus.appendChild(option);
  }
});

async function sortTable(columnIndex) {
  flagfilter = true;
  columnSelected = columnIndex;
  //currentPage = 1;
  const orderbyClienteURL = `http://localhost:3000/orderbyCliente?page=${currentPage}&limit=10`;
  console.log(columnIndex);
  const res = await fetch(orderbyClienteURL, {
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
      let place = document.querySelector("#data-output");
      let fromSelectedRow = "";
      for (let producto of data.results) {
        fromSelectedRow += `<tr class="row">
          <td>${producto.ClienteID} </td>
          <td>${producto.Nombre} </td>
          <td>${producto.Direccion} </td>
          <td>${producto.Colonia} </td>
          <td>${producto.Referencia} </td>
          <td>${producto.Telefono} </td>
          <td>${producto.Identidad} </td>
          <td>${producto.Estado} </td>
      </tr>`;
      }

      place.innerHTML = fromSelectedRow;
      process();
      /*
      console.log("holaaa")
      for(let j = 0; j < rows.length; j++){
        rows[j].addEventListener('click', async () =>{
          console.log("hola")
        })
      }
      process()      */

      //ComboStatus.selectedIndex = 1;
    });
}
const filtroColonia = document.getElementById("inputFiltroColonia");
filtroColonia.addEventListener("input", async function () {
  currentPage = 1;
  const URLfilterColonia = `http://localhost:3000/getFilterColoniaInCliente?page=${currentPage}&limit=10`;
  dato = this.value.trim();
  filtroClientes(URLfilterColonia, dato);
});
const filtroNombre = document.getElementById("inputFiltroNombre");
filtroNombre.addEventListener("input", async function () {
  currentPage = 1;
  const URLfilterName = `http://localhost:3000/getFilterName?page=${currentPage}&limit=10`;
  dato = this.value.trim();
  filtroClientes(URLfilterName, dato);
});

const URLfilterIdentidad = "http://localhost:3000/getFilterIdentidadInCliente";

const filtroIdentidad = document.getElementById("inputFiltroIdentidad");
filtroIdentidad.addEventListener("input", async function () {
  currentPage = 1;
  const URLfilterIdentidad = `http://localhost:3000/getFilterIdentidadInCliente?page=${currentPage}&limit=10`;
  dato = this.value.trim();
  filtroClientes(URLfilterIdentidad, dato);
});

const filtroEstado = document.getElementById("inputFiltroEstado");

filtroEstado.addEventListener("input", async function () {
  currentPage = 1;
  const URLfilterEstado = `http://localhost:3000/getFilterEstadoInCliente?page=${currentPage}&limit=10`;
  dato = this.value.trim();
  filtroClientes(URLfilterEstado, dato);
});

popConfirmation.addEventListener("click", function () {
  popup.classList.remove("open-popup");
  location.reload();
});

async function filtroClientes(URL, Dato) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: {
        Nombre: Dato,
      },
    }),
  })
    .then((response) => response.json())
    .then(function (data) {
      let place = document.querySelector("#data-output");
      let fromSelectedRow = "";
      for (let producto of data.results) {
        fromSelectedRow += `<tr class="row">
          <td>${producto.ClienteID} </td>
          <td>${producto.Nombre} </td>
          <td>${producto.Direccion} </td>
          <td>${producto.Colonia} </td>
          <td>${producto.Referencia} </td>
          <td>${producto.Telefono} </td>
          <td>${producto.Identidad} </td>
          <td>${producto.Estado} </td>
      </tr>`;
      }
      place.innerHTML = fromSelectedRow;
      process();
    });
}

async function process() {
  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener("click", async function () {
      const cells = this.getElementsByTagName("td");
      DatosCliente.ID = cells[0].innerHTML;
      DatosCliente.Nombre = cells[1].innerHTML;
      DatosCliente.Direccion = cells[2].innerHTML;
      DatosCliente.Colonia = cells[3].innerHTML;
      DatosCliente.Referencia = cells[4].innerHTML;
      DatosCliente.Telefono = cells[5].innerHTML;
      DatosCliente.Identidad = cells[6].innerHTML;
      DatosCliente.Estado = cells[7].innerHTML;

      const res = await fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parcel: {
            ID: DatosCliente.ID,
          },
        }),
      })
        .then((response) => response.json())
        .then(function (data) {
          let place = document.querySelector("#data-output");
          let fromSelectedRow = "";
          for (let producto of data) {
            fromSelectedRow += `<tr class="row">
              <td>${producto.ClienteID} </td>
              <td>${producto.Nombre} </td>
              <td>${producto.Direccion} </td>
              <td>${producto.Colonia} </td>
              <td>${producto.Referencia} </td>
              <td>${producto.Telefono} </td>
              <td>${producto.Identidad} </td>
              <td>${producto.Estado} </td>
          </tr>`;
          }

          place.innerHTML = fromSelectedRow;

          popup.classList.add("mostrarEditar-popup");
          //ComboStatus.selectedIndex = 1;
          inputNombre.value = DatosCliente.Nombre.trim();
          inputDireccion.value = DatosCliente.Direccion.trim();
          //inputColonia.value = DatosCliente.Colonia;
          inputReferencia.value = DatosCliente.Referencia.trim();
          inputTelefono.value = DatosCliente.Telefono.trim();
          inputIdentidad.value = DatosCliente.Identidad.trim();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }
}
