let currentPage = 1;
let columnSelected = null;
let flagfilter = false;
const tabla = document.getElementById("TbVisitas");
const rows = tabla.getElementsByTagName("tr");
const postURL = "http://localhost:3000/ClienteSeleccionado";
const viewUrl = `http://localhost:3000/VerClientesActivos?page=${currentPage}&limit=10`;
const getURLTecnicos = "http://localhost:3000/gettecnicosDisponiblesCombo";
const ComboTecnico = document.getElementById("TechDropdown");
const postCrearVisita = "http://localhost:3000/CrearVisita";
const brnCrear = document.getElementById("Crear");
const inputaño = document.getElementById("year");
const inputmes = document.getElementById("month");
const inputdia = document.getElementById("day");
let tecnicos = [];
let selectedTech = null;
const popup = document.getElementById("popup");

const fecha = inputaño.value + "-" + inputmes.value + "-" + inputdia.value;
let Datos = {
  IDCliente: null,
  IDTecnico: null,
  NombreCliente: null,
};
ComboTecnico.addEventListener("change", function () {
  selectedTech = this.value;

  for (let j = 0; j < tecnicos.length; j++) {
    if (tecnicos[j].NombreTec == selectedTech) {
      Datos.IDTecnico = tecnicos[j].TecnicoID;
    }
  }
});

addEventListener("DOMContentLoaded", function () {
  fetch(viewUrl)
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
                <td>${product.Colonia} </td>
                <td>${product.Telefono} </td>
            </tr>
        `;
      }
      placeholder.innerHTML = out;
      for (let i = 0; i < rows.length; i++) {
        rows[i].addEventListener("click", async function () {
          const cells = this.getElementsByTagName("td");
          Datos.IDCliente = cells[0].innerHTML;
          Datos.NombreCliente = cells[1].innerHTML;
          const res = await fetch(postURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              parcel: {
                ID: Datos.IDCliente.trim(),
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
                fromSelectedRow += `
                <tr>
                <td>${product.ClienteID} </td>
                <td>${product.Nombre} </td>
                <td>${product.Colonia} </td>
                <td>${product.Telefono} </td>
                </tr>`;
              }
              placeSelected.innerHTML = fromSelectedRow;
            });
        });
      }
    });
});

addEventListener("DOMContentLoaded", async function () {
  const res = await fetch(getURLTecnicos, {
    method: "GET",
  });
  tecnicos = await res.json();

  for (let i = 0; i < tecnicos.length; i++) {
    const option = document.createElement("option");
    option.value = tecnicos[i].NombreTec;
    option.text = tecnicos[i].NombreTec;
    ComboTecnico.appendChild(option);
  }
});

brnCrear.addEventListener("click", async function () {
  const date = new Date();
    day = date.getDate();
    month = 4;
    console.log(day)
    
  if (
    ComboServicio.selectedIndex == 0 ||
    ComboServicio.selectedIndex == 0 ||
    inputmes.value == "--" ||
    inputdia.value == "--" ||
    inputaño.value == "" ||
    Datos.IDCliente == null
  ) {
    alert("Por favor llene todos los campos");
  } else if (inputaño.value > 2025 || inputaño.value < 2023) {
    alert("Ingrese un año valido");
  } else if (inputmes.value > 12) {
    alert("Ingrese un mes valido");
  } else if (inputdia.value > 31) {
    alert("Ingrese un dia valido");
  } else if (
    (inputmes.value == 4 ||
      inputmes.value == 6 ||
      inputmes.value == 9 ||
      inputmes.value == 11) &&
    inputdia.value == 31
  ) {
    alert("Este mes no tiene 31 dias");
  } else if (inputmes.value == 2 && inputdia.value > 29) {
    alert("Este mes no tiene mas de 29 dias");
  } 
  else if(inputdia.value < day && inputmes.value == month){
    alert("Ingrese un dia valido")
  }else if(inputmes.value < month){
    alert("Ingrese un mes valido")
  }
  else {
    
    console.log("Array", Datos.IDCliente);
    const res = await fetch(postCrearVisita, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parcel: {
          IDCliente: Datos.IDCliente.trim(),
          IDTec: Datos.IDTecnico,
          Servicio: ComboServicio.value.trim(),
          Year: inputaño.value.trim(),
          Mes: inputmes.value.trim(),
          Dia: inputdia.value.trim(),
          NombreCliente: Datos.NombreCliente.trim(),
        },
      }),
    }).catch((error) => {
      console.error(error);

      alert("Hubo error al mandar los datos");
    });
    if (res.ok) {
      console.log("hola mundo ok");
      inputaño.value = "";
      inputmes.value = "";
      inputdia.value = "";
      popup.classList.add("open-popup");
    }
  }
});

ComboServicio = document.getElementById("StatusDropdown");
let Servicios = [
  "Reparación",
  "Instalación",
  "Mantenimiento",
  "Cambio de equipo",
];

addEventListener("DOMContentLoaded", function () {
  for (let i = 0; i < Servicios.length; i++) {
    const option = document.createElement("option");
    option.value = Servicios[i];
    option.text = Servicios[i];
    ComboServicio.appendChild(option);
  }
});

popup.addEventListener("click", function () {
  popup.classList.remove("open-popup");
  location.reload();
});

btnResetear = document.getElementById("reset");

btnResetear.addEventListener("click", function () {
  location.reload();
});

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
        <td>${producto.Colonia} </td>
        <td>${producto.Telefono} </td>
      </tr>`;
      }

      place.innerHTML = fromSelectedRow;
    });
}

const filtroNombre = document.getElementById("inputFiltroNombre");
//const filtroNombre = document.getElementById("inputFiltro");

filtroNombre.addEventListener("input", async function () {
  filtroColonia.value = "";
  currentPage = 1;
  const URLfilterName = `http://localhost:3000/getFilterName?page=${currentPage}&limit=10`;
  const res = await fetch(URLfilterName, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: {
        Nombre: this.value.trim().toLowerCase(),
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
        <td>${producto.Colonia} </td>
        <td>${producto.Telefono} </td>
      </tr>`;
      }

      place.innerHTML = fromSelectedRow;
      process();

      //ComboStatus.selectedIndex = 1;
    });
});

const filtroColonia = document.getElementById("inputFiltroColonia");
filtroColonia.addEventListener("input", async function () {
  filtroNombre.value = "";
  currentPage = 1;

  const URLfilterColonia = `http://localhost:3000/getFilterColoniaInCliente?page=${currentPage}&limit=10`;
  const res = await fetch(URLfilterColonia, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: {
        Nombre: this.value.trim().toLowerCase(),
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
        <td>${producto.Colonia} </td>
        <td>${producto.Telefono} </td>
      </tr>`;
      }

      place.innerHTML = fromSelectedRow;
      process();
      //ComboStatus.selectedIndex = 1;
    });
});

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

btnPrev.addEventListener("click", () => {


  if (currentPage == 1) {
  } else if (flagfilter == true) {
    currentPage = currentPage - 1;
    const orderbyClienteURL = `http://localhost:3000/orderbyCliente?page=${currentPage}&limit=10`;
    fetchwithURL(orderbyClienteURL, columnSelected);
  } else {
    currentPage = currentPage - 1;
    let vistaPag = `http://localhost:3000/VerClientesActivos?page=${currentPage}&limit=10`;

    fetch(vistaPag)
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
                <td>${product.Colonia} </td>
                <td>${product.Telefono} </td>
            </tr>
        `;
        }
        placeholder.innerHTML = out;
        process();
      });
  }
});

btnNext.addEventListener("click", () => {
  if (flagfilter == true) {
    console.log(columnSelected);
    currentPage = currentPage + 1;

    const orderbyClienteURL = `http://localhost:3000/orderbyCliente?page=${currentPage}&limit=10`;
    fetchwithURL(orderbyClienteURL, columnSelected);
    process()
  }else{
    currentPage = currentPage + 1;
    let vistaPag = `http://localhost:3000/VerClientesActivos?page=${currentPage}&limit=10`;
  
    fetch(vistaPag)
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
                  <td>${product.Colonia} </td>
                  <td>${product.Telefono} </td>
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
      Datos.IDCliente = cells[0].innerHTML;
      Datos.NombreCliente = cells[1].innerHTML;
      const res = await fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parcel: {
            ID: Datos.IDCliente.trim(),
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
            fromSelectedRow += `
            <tr>
            <td>${product.ClienteID} </td>
            <td>${product.Nombre} </td>
            <td>${product.Colonia} </td>
            <td>${product.Telefono} </td>
            </tr>`;
          }
          placeSelected.innerHTML = fromSelectedRow;
        });
    });
  }
}

async function fetchwithURL(URL, Columna) {
  console.log("pagina actual", currentPage);
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
      let place = document.querySelector("#data-output");
      let fromSelectedRow = "";
      for (let producto of data.results) {
        fromSelectedRow += `<tr class="row">
        <td>${producto.ClienteID} </td>
        <td>${producto.Nombre} </td>
        <td>${producto.Colonia} </td>
        <td>${producto.Telefono} </td>
      </tr>`;
      }

      place.innerHTML = fromSelectedRow;
      process();
      //ComboStatus.selectedIndex = 1;
    });
}
