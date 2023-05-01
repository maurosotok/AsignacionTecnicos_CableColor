const boton = document.getElementById("BTNDesactivar");
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
const getClientes = "http://localhost:3000/getClientesActivosPendientes";
const postUrl = "http://localhost:3000/ClienteSeleccionado";
const deactivateURL = "http://localhost:3000/DesactivarCliente";
const tabla = document.getElementById("table");
const rows = tabla.getElementsByTagName("tr");

document.getElementById("btnReset").addEventListener("click", function () {
  location.reload()
});

addEventListener("DOMContentLoaded", function () {
  fetch(getClientes)
    .then(function (res) {
      return res.json();
    })
    .then(function (vista) {
      let placeholder = document.querySelector("#data-output");
      let out = "";
      for (let product of vista) {
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
      for (let i = 0; i < rows.length; i++) {
        rows[i].addEventListener("click", async function () {
          const cells = this.getElementsByTagName("td");
          console.log(cells);

          DatosCliente.ID = cells[0].innerHTML;

          const res = await fetch(postUrl, {
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
              //popup.classList.add("open-popup");

              console.log(data[0].ClienteID);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
      }
    });
});
boton.addEventListener("click", async function () {
  const res = await fetch(deactivateURL, {
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
      //popup.classList.add("open-popup");

      console.log(data[0].ClienteID);
    });
});

function sortTable(columnIndex) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("table");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("tr");
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[columnIndex];
      y = rows[i + 1].getElementsByTagName("td")[columnIndex];
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

const filtroColonia = document.getElementById("inputFiltroColonia");
filtroColonia.addEventListener("input", function () {
  var filtro1 = this.value.toLowerCase();
  var tabla = document.getElementById("data-output");
  var filas = tabla.getElementsByTagName("tr");

  for (var i = 0; i < filas.length; i++) {
    var datosFila = filas[i].getElementsByTagName("td");
    var mostrarFila = false;

    for (var j = 0; j < datosFila.length; j++) {
      var dato = datosFila[j].innerText.toLowerCase();
      if (dato.indexOf(filtro1) > -1) {
        mostrarFila = true;
        break;
      }
    }
    filas[i].style.display = mostrarFila ? "" : "none";
  }
});

const filtroNombre = document.getElementById("inputFiltroNombre");
filtroNombre.addEventListener("input", function () {
  var filtro1 = this.value.toLowerCase();
  var tabla = document.getElementById("data-output");
  var filas = tabla.getElementsByTagName("tr");

  for (var i = 0; i < filas.length; i++) {
    var datosFila = filas[i].getElementsByTagName("td");
    var mostrarFila = false;

    for (var j = 0; j < datosFila.length; j++) {
      var dato = datosFila[j].innerText.toLowerCase();
      if (dato.indexOf(filtro1) > -1) {
        mostrarFila = true;
        break;
      }
    }
    filas[i].style.display = mostrarFila ? "" : "none";
  }
});

const filtroIdentidad = document.getElementById("inputFiltroIdentidad");
filtroIdentidad.addEventListener("input", function () {
  var filtro1 = this.value.toLowerCase();
  var tabla = document.getElementById("data-output");
  var filas = tabla.getElementsByTagName("tr");

  for (var i = 0; i < filas.length; i++) {
    var datosFila = filas[i].getElementsByTagName("td");
    var mostrarFila = false;

    for (var j = 0; j < datosFila.length; j++) {
      var dato = datosFila[j].innerText.toLowerCase();
      if (dato.indexOf(filtro1) > -1) {
        mostrarFila = true;
        break;
      }
    }
    filas[i].style.display = mostrarFila ? "" : "none";
  }
});

const filtroEstado = document.getElementById("inputFiltroEstado");
filtroEstado.addEventListener("input", function () {
  var filtro1 = this.value.toLowerCase();
  var tabla = document.getElementById("data-output");
  var filas = tabla.getElementsByTagName("tr");

  for (var i = 0; i < filas.length; i++) {
    var datosFila = filas[i].getElementsByTagName("td");
    var mostrarFila = false;

    for (var j = 0; j < datosFila.length; j++) {
      var dato = datosFila[j].innerText.toLowerCase();
      if (dato.indexOf(filtro1) > -1) {
        mostrarFila = true;
        break;
      }
    }
    filas[i].style.display = mostrarFila ? "" : "none";
  }
});
