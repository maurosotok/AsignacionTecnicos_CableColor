const contentTable = document.getElementById("data-output");
let flagfilter = false;
let currentPage = 1;
let getVisitasUrl = `http://localhost:3000/clientes?page=${currentPage}&limit=10`;
let columnSelected = 0;

addEventListener("DOMContentLoaded", () => {
  let titulo = document.querySelector("#title");
  fetch(getVisitasUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (vista) {
      let placeholder = document.querySelector("#data-output");
      let out = "";
      console.log(vista);
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
      const date = new Date();
      year = date.getFullYear();
      placeholder.innerHTML = out;
      titulo.innerHTML = `Listado de clientes a ${year}`;
    });
});
const btnNext = document.getElementById("btnNext");

btnNext.addEventListener("click", async () => {
  if (flagfilter == true) {
    currentPage = currentPage + 1;
    columnSelected;
    const orderbyClienteURL = `http://localhost:3000/orderbyCliente?page=${currentPage}&limit=10`;
    const res = await fetch(orderbyClienteURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parcel: {
          Columna: columnSelected,
        },
      }),
    })
      .then((response) => response.json())
      .then(function (data) {
        console.log(data);
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

        //ComboStatus.selectedIndex = 1;
      });
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
        console.log(vista);
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
      });
  }
});

const btnPrev = document.getElementById("btnPrev");

btnPrev.addEventListener("click", async () => {
  if (currentPage == 1) {
  } else if (flagfilter == true) {
    currentPage = currentPage - 1;
    columnSelected;
    const orderbyClienteURL = `http://localhost:3000/orderbyCliente?page=${currentPage}&limit=10`;
    const res = await fetch(orderbyClienteURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parcel: {
          Columna: columnSelected,
        },
      }),
    })
      .then((response) => response.json())
      .then(function (data) {
        console.log(data);
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
      });
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
        console.log(vista);
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
      });
  }
});

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
    });
}
async function sortTable(columnIndex) {
  flagfilter = true;
  columnSelected = columnIndex;
  currentPage = 1;
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
      console.log(data);
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
    });
}
