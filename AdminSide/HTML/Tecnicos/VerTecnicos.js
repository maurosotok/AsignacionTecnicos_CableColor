let currentPage = 1;
let flagfilter = false;
let flagCheckBox = false;
let comboestado = null;
getVisitasUrl = `http://localhost:3000/Tecnicos?page=${currentPage}&limit=10`;
TecnicosUrl = `http://localhost:3000/tecnicosDisponibles?page=${currentPage}&limit=10`;
//const cb = document.getElementById("OnlyAvailables");
const ComboStatus = document.getElementById("StatusDropdown");
let estados = ["Disponible", "Ocupado", "Desactivado"];

addEventListener("DOMContentLoaded", async function () {
  let titulo = document.querySelector("#title");
  for (let i = 0; i < estados.length; i++) {
    const option = document.createElement("option");
    option.value = estados[i];
    option.text = estados[i];
    ComboStatus.appendChild(option);
  }
  const res = await fetch(getVisitasUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (vista) {
      let placeholder = document.querySelector("#data-output");
      let out = "";
      for (let product of vista.results) {
        let fechaString = product.Tenure;
        const fecha = new Date(fechaString);
        const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
        const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
        out += `
            <tr>
                <td>${product.TecnicoID} </td>
                <td>${product.UserName} </td>
                <td>${product.NombreTec} </td>
                <td>${product.Emailaddress} </td>
                <td>${fechaFormateada} </td>
                <td>${product.Disponibilidad} </td>
            </tr>
        `;
      }
      placeholder.innerHTML = out;
      const date = new Date();

      day = date.getDate();
      month = "Abril";
      year = date.getFullYear();
      const fecha = month + "/" + day + "/" + year;
      titulo.innerHTML = `Todos los tecnicos a ${fecha}`;
    });
});

/*

cb.addEventListener("change", function () {
  if (cb.checked == false) {
    const res = fetch(getVisitasUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let titulo = document.querySelector("#title");
        let placeholder = document.querySelector("#data-output");
        let out = "";
        for (let product of vista.results) {
          let fechaString = product.Tenure;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
          out += `
            <tr>
                <td>${product.TecnicoID} </td>
                <td>${product.UserName} </td>
                <td>${product.NombreTec} </td>
                <td>${product.Emailaddress} </td>
                <td>${fechaFormateada} </td>
            </tr>
        `;
        }
        placeholder.innerHTML = out;
        const date = new Date();
        day = date.getDate();
        month = "Abril";
        year = date.getFullYear();
        const fecha = month + "/" + day + "/" + year;
        titulo.innerHTML = `Todos los tecnicos a ${fecha}`;
      });
  }
  if (cb.checked == true) {
    flagCheckBox = true;
    const res = fetch(TecnicosUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (view) {
        let nuevoph = document.querySelector("#data-output");
        let titulo = document.querySelector("#title");

        let nuevoout = "";
        for (let product of view.results) {
          let fechaString = product.Tenure;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
          nuevoout += `
                <tr>
                    <td>${product.TecnicoID} </td>
                    <td>${product.UserName} </td>
                    <td>${product.NombreTec} </td>
                    <td>${product.Emailaddress} </td>
                    <td>${fechaFormateada} </td>
                </tr>
            `;
        }
        nuevoph.innerHTML = nuevoout;
        const date = new Date();

        day = date.getDate();
        month = "Abril";
        year = date.getFullYear();
        const fecha = month + "/" + day + "/" + year;
        console.log(fecha);

        titulo.innerHTML = `Tecnicos disponibles  ${fecha}`;
      });
  }
});
*/
const tabla = document.getElementById("tablaTecnicos");

async function sortTable(columnIndex) {
  flagfilter = true;
  columnSelected = columnIndex;
  //currentPage = 1;
  const orderbyTecnicoURL = `http://localhost:3000/orderbyTecnico?page=${currentPage}&limit=10`;

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
    .then((res) => res.json())
    .then(function (data) {
      console.log(data);

      let place = document.querySelector("#data-output");
      let fromSelectedRow = "";
      let nuevoout = "";
      for (let product of data.results) {
        let fechaString = product.Tenure;
        const fecha = new Date(fechaString);
        const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
        const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
        fromSelectedRow += `
              <tr>
                  <td>${product.TecnicoID} </td>
                  <td>${product.UserName} </td>
                  <td>${product.NombreTec} </td>
                  <td>${product.Emailaddress} </td>
                  <td>${fechaFormateada} </td>
                  <td>${product.Disponibilidad} </td>
              </tr>
          `;
      }

      place.innerHTML = fromSelectedRow;
    });
}

const filtroUsuario = document.getElementById("inputFiltroUsuario");
filtroUsuario.addEventListener("input", async function () {
  currentPage = 1;
  const URLFilterName = `http://localhost:3000/getFilterUserNameInTech?page=${currentPage}&limit=10`;
  dato = this.value.trim();
  filtroTecnicos(URLFilterName, dato);
});

const inputFiltroNombre = document.getElementById("inputFiltroNombre");

inputFiltroNombre.addEventListener("input", async function () {
  currentPage = 1;
  const URLFilterName = `http://localhost:3000/getFilterNameInTech?page=${currentPage}&limit=10`;
  dato = this.value.trim();
  filtroTecnicos(URLFilterName, dato);
});

const inputFiltroCorreo = document.getElementById("inputFiltroCorreo");
inputFiltroCorreo.addEventListener("input", async function () {
  currentPage = 1;
  const URLFilterName = `http://localhost:3000/getFiltereEmailInTech?page=${currentPage}&limit=10`;
  dato = this.value.trim();
  filtroTecnicos(URLFilterName, dato);
});

async function filtroTecnicos(URL, Dato) {
  try {
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
        for (let product of data.results) {
          let fechaString = product.Tenure;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
          fromSelectedRow += `
                <tr>
                    <td>${product.TecnicoID} </td>
                    <td>${product.UserName} </td>
                    <td>${product.NombreTec} </td>
                    <td>${product.Emailaddress} </td>
                    <td>${fechaFormateada} </td>
                    <td>${product.Disponibilidad} </td>
                </tr>
            `;
        }
        place.innerHTML = fromSelectedRow;
        //process();
      });
  } catch (error) {
    let fromSelectedRow = "";
    let place = document.querySelector("#data-output");
    fromSelectedRow += `<tr class="row">
              
            </tr>`;
    place.innerHTML = fromSelectedRow;
  }
}

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

const filtroCorreo = document.getElementById("inputFiltroCorreo");
filtroCorreo.addEventListener("input", function () {
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

ComboStatus.addEventListener("change", async function () {
  currentPage = 1;
  comboestado = this.value;
  const URLFilterName = `http://localhost:3000/getFiltereEstadoInTech?page=${currentPage}&limit=10`;
  showFetchwithCombo(URLFilterName, comboestado);
});

const btnNext = document.getElementById("btnNext");

btnNext.addEventListener("click", async () => {
  if (flagfilter == true) {
    currentPage = currentPage + 1;
    columnSelected;
    const orderbyTecnicoURL = `http://localhost:3000/orderbyTecnico?page=${currentPage}&limit=10`;
    fetchwithURL(orderbyTecnicoURL, columnSelected);
  } else if (comboestado == "Disponible") {
    currentPage = currentPage + 1;
    const URLFilterName = `http://localhost:3000/getFiltereEstadoInTech?page=${currentPage}&limit=10`;
    showFetchwithCombo(URLFilterName, comboestado);
  } else if (comboestado == "Ocupado") {
    currentPage = currentPage + 1;
    const URLFilterName = `http://localhost:3000/getFiltereEstadoInTech?page=${currentPage}&limit=10`;
    showFetchwithCombo(URLFilterName, comboestado);
  } else if (comboestado == "Desactivado") {
    currentPage = currentPage + 1;
    const URLFilterName = `http://localhost:3000/getFiltereEstadoInTech?page=${currentPage}&limit=10`;
    showFetchwithCombo(URLFilterName, comboestado);
  } else {
    currentPage = currentPage + 1;
    getVisitasUrl = `http://localhost:3000/Tecnicos?page=${currentPage}&limit=10`;
    fetch(getVisitasUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#data-output");
        let out = "";
        console.log(vista);
        for (let product of vista.results) {
          let fechaString = product.Tenure;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
          out += `
              <tr>
                  <td>${product.TecnicoID} </td>
                  <td>${product.UserName} </td>
                  <td>${product.NombreTec} </td>
                  <td>${product.Emailaddress} </td>
                  <td>${fechaFormateada} </td>
                  <td>${product.Disponibilidad} </td>
              </tr>
          `;
        }
        placeholder.innerHTML = out;
      });
  }
});

async function fetchwithURL(URL, Columna) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: {
        Columna: Columna,
      },
    }),
  })
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      let place = document.querySelector("#data-output");
      let fromSelectedRow = "";
      for (let product of data.results) {
        let fechaString = product.Tenure;
        const fecha = new Date(fechaString);
        const opciones = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        };
        const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
        fromSelectedRow += `
            <tr>
                <td>${product.TecnicoID} </td>
                <td>${product.UserName} </td>
                <td>${product.NombreTec} </td>
                <td>${product.Emailaddress} </td>
                <td>${fechaFormateada} </td>
                <td>${product.Disponibilidad} </td>
            </tr>
        `;
      }
      place.innerHTML = fromSelectedRow;
    });
}

const btnPrev = document.getElementById("btnPrev");

btnPrev.addEventListener("click", async () => {
  if (currentPage == 1) {
  } else if (flagfilter == true) {
    currentPage = currentPage - 1;
    // sortTable(columnSelected)
    const orderbyTecnicoURL = `http://localhost:3000/orderbyTecnico?page=${currentPage}&limit=10`;
    fetchwithURL(orderbyTecnicoURL, columnSelected);
  } else if (comboestado == "Disponible") {
    currentPage = currentPage - 1;
    const URLFilterName = `http://localhost:3000/getFiltereEstadoInTech?page=${currentPage}&limit=10`;
    showFetchwithCombo(URLFilterName, comboestado);
  } else if (comboestado == "Ocupado") {
    currentPage = currentPage - 1;
    const URLFilterName = `http://localhost:3000/getFiltereEstadoInTech?page=${currentPage}&limit=10`;
    showFetchwithCombo(URLFilterName, comboestado);
  } else if (comboestado == "Desactivado") {
    currentPage = currentPage - 1;
    const URLFilterName = `http://localhost:3000/getFiltereEstadoInTech?page=${currentPage}&limit=10`;
    showFetchwithCombo(URLFilterName, comboestado);
  } else if (flagfilter == true) {
    currentPage = currentPage - 1;
    columnSelected;
    const orderbyTecnicoURL = `http://localhost:3000/orderbyTecnico?page=${currentPage}&limit=10`;
    const res = await fetch(orderbyTecnicoURL, {
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

        for (let product of data.results) {
          let fechaString = product.Tenure;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
          fromSelectedRow += `
              <tr>
                  <td>${product.TecnicoID} </td>
                  <td>${product.UserName} </td>
                  <td>${product.NombreTec} </td>
                  <td>${product.Emailaddress} </td>
                  <td>${fechaFormateada} </td>
                  <td>${product.Disponibilidad} </td>
              </tr>
          `;
        }
        place.innerHTML = fromSelectedRow;
      });
  } else {
    currentPage = currentPage - 1;
    getVisitasUrl = `http://localhost:3000/Tecnicos?page=${currentPage}&limit=10`;
    fetch(getVisitasUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#data-output");
        let out = "";
        console.log(vista);
        for (let product of vista.results) {
          let fechaString = product.Tenure;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
          out += `
              <tr>
                  <td>${product.TecnicoID} </td>
                  <td>${product.UserName} </td>
                  <td>${product.NombreTec} </td>
                  <td>${product.Emailaddress} </td>
                  <td>${fechaFormateada} </td>
                  <td>${product.Disponibilidad} </td>
              </tr>
          `;
        }
        placeholder.innerHTML = out;
      });
  }
});

async function showFetchwithCombo(URL, Dato) {
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
      for (let product of data.results) {
        let fechaString = product.Tenure;
        const fecha = new Date(fechaString);
        const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
        const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
        fromSelectedRow += `
              <tr>
                  <td>${product.TecnicoID} </td>
                  <td>${product.UserName} </td>
                  <td>${product.NombreTec} </td>
                  <td>${product.Emailaddress} </td>
                  <td>${fechaFormateada} </td>
                  <td>${product.Disponibilidad} </td>
              </tr>
          `;
      }
      place.innerHTML = fromSelectedRow;
    });
}
