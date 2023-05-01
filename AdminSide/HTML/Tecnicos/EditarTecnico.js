let currentPage = 1;
let flagfilter = false;
const btnEditar = document.getElementById("btnEditar");
const ComboStatus = document.getElementById("StatusDropdown");
getVisitasUrl = `http://localhost:3000/getTecnicosForEdit?page=${currentPage}&limit=10`;
const btnPrev = document.getElementById("btnPrev");
//const btnNext = document.getElementById("btnNext");
const tabla = document.getElementById("table");
const rows = tabla.getElementsByTagName("tr");
let popEditar = document.getElementById("popup")
let popup = document.getElementById("mostrarEditar");
let flagchange = false
const inputName = document.getElementById("inputName");
const inputUserName = document.getElementById("inputUserName");
const inputemail = document.getElementById("inputemail");
//const inputPassword = document.getElementById("inputPassword")
//const inputPasswordCheck = document.getElementById("inputPasswordCheck")
const postURL = "http://localhost:3000/postTecnicoSeleccionado";
const StatusDropdownFilter = document.getElementById("StatusDropdownFilter")
let DatosTecnico = {
  ID: null,
  Usuario: null,
  Nombre: null,
  Correo: null,
  Fecha: null,
  Estado: null,
};
//cambio a disponible por: errores por parte del tecnico(no póder aceptar)
//cambio a ocupado: dias vacaciones o no esta disponible
//cambio a desactivado: despedido
let estados = ["Disponible", "Ocupado", "Desactivado"];


ComboStatus.addEventListener("change", function(){
  flagchange = true
})

popEditar.addEventListener("click", function () {
  popEditar.classList.remove("open-popup");
  location.reload();
});

StatusDropdownFilter.addEventListener("change", async function () {
  currentPage = 1;
  comboestado = this.value;
  const URLFilterName = `http://localhost:3000/getFiltereEstadoInTech?page=${currentPage}&limit=10`;
  showFetchwithCombo(URLFilterName, comboestado);
});


addEventListener("DOMContentLoaded", function () {

  for (let i = 0; i < estados.length; i++) {
    const option = document.createElement("option");
    option.value = estados[i];
    option.text = estados[i];
    StatusDropdownFilter.appendChild(option);
  }
  for (let i = 0; i < estados.length; i++) {
    const option = document.createElement("option");
    option.value = estados[i];
    option.text = estados[i];
    ComboStatus.appendChild(option);
  }

  fetch(getVisitasUrl)
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
        </tr>`;
      }

      placeholder.innerHTML = out;
      process();
    });
});
document.getElementById("btnReset").addEventListener("click", () => {
  location.reload();
});

const UpdateURL = "http://localhost:3000/ActualizarTecnico";

btnEditar.addEventListener("click", async () => {

  const regex = /\d/;
  let valorCombo = null;
  if (ComboStatus.selectedIndex == 0) {
    valorCombo = DatosTecnico.Estado;
    console.log(DatosTecnico.Estado);
  } else {
    valorCombo = ComboStatus.value;
  }

  if(inputName.value.length < 7){
    alert("Ingresa un nombre mas largo")
  }else if(inputUserName.value.length <8){
    alert("Ingresa un nombre de usuario mas largo")
  }else if(inputemail.value.length <9){
    alert("Ingresa un correo electronico mas largo")
  }
  else if (regex.test(inputName.value) == true) {
    alert("No se permiten numeros");
  }
  
  else if(inputUserName.value.includes('.') == false ||inputUserName.value.includes(' ') == true ){
    alert("Usuario invalido")
  }else if(inputemail.value.includes('@') == false || inputemail.value.includes('.hn') == false || inputemail.value.trim().includes(' ') == true){
    alert("Correo electronico no valido")
  }else{
    const res = await fetch(UpdateURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parcel: {
          ID: DatosTecnico.ID,
          Nombre: inputName.value,
          Usuario: inputUserName.value,
          Correo: inputemail.value,
          Estado: valorCombo.trim(),
          Confirmacion: flagchange
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
  
        placeSelected.innerHTML = fromSelectedRow;
        popEditar.classList.add("open-popup");
      });
  }


 
});

btnNext.addEventListener("click", () => {
  if (flagfilter == true) {
    currentPage = currentPage + 1;
    console.log(currentPage);
    sortTable(columnSelected);
  }else if (comboestado == "Disponible") {
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
  }
  
  else {
    currentPage = currentPage + 1;
    getVisitasUrl1 = `http://localhost:3000/getTecnicosForEdit?page=${currentPage}&limit=10`;
    fetch(getVisitasUrl1)
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
        process();
      });
  }
});
btnPrev.addEventListener("click", () => {
  if (currentPage == 1) {
  } else if (flagfilter == true) {
    currentPage = currentPage - 1;
    sortTable(columnSelected);
  }else if (comboestado == "Disponible") {
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
  } 
  else {
    currentPage = currentPage - 1;
    getVisitasUrl = `http://localhost:3000/getTecnicosForEdit?page=${currentPage}&limit=10`;
    fetch(getVisitasUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#data-output");
        let fromSelectedRow = "";
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
        placeholder.innerHTML = fromSelectedRow;
        process();
      });
  }
});

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
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
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
      process()
    });
}

const inputFiltroNombre = document.getElementById("inputFiltroNombre");

inputFiltroNombre.addEventListener("input", async function () {
  try {
    currentPage = 1;
    const URLFilterName = `http://localhost:3000/getFilterNameInTech?page=${currentPage}&limit=10`;
    const res = await fetch(URLFilterName, {
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
        console.log(data.results);
        if (data.results == undefined) {
        }

        process();
      });
  } catch (error) {
    let fromSelectedRow = "";
    let place = document.querySelector("#data-output");
    fromSelectedRow += `<tr class="row">
          
        </tr>`;
    place.innerHTML = fromSelectedRow;
  }
});

async function showFetchwithCombo(URL, Dato){
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
      process()
    });
}
async function process() {
  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener("click", async function () {
      const cells = this.getElementsByTagName("td");
      DatosTecnico.ID = cells[0].innerHTML;
      DatosTecnico.Usuario = cells[1].innerHTML;
      DatosTecnico.Nombre = cells[2].innerHTML;
      DatosTecnico.Correo = cells[3].innerHTML;
      DatosTecnico.Fecha = cells[4].innerHTML;
      DatosTecnico.Estado = cells[5].innerHTML;
      const res = await fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parcel: {
            ID: DatosTecnico.ID,
          },
        }),
      })
        .then((response) => response.json())
        .then(function (data) {
          let place = document.querySelector("#data-output");
          let fromSelectedRow = "";
          for (let producto of data) {
            let fechaString = producto.Tenure;
            const fecha = new Date(fechaString);
            const opciones = {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            };
            const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);

            fromSelectedRow += `<tr class="row">
          <td>${producto.TecnicoID} </td>
          <td>${producto.UserName} </td>
          <td>${producto.NombreTec} </td>
          <td>${producto.Emailaddress} </td>
          <td>${fechaFormateada} </td>
          <td>${producto.Disponibilidad} </td>
        </tr>`;
          }
          place.innerHTML = fromSelectedRow;
          popup.classList.add("mostrarEditar-popup");
          inputName.value = DatosTecnico.Nombre.trim();
          inputUserName.value = DatosTecnico.Usuario.trim();
          inputemail.value = DatosTecnico.Correo.trim();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }
}

const inputFiltroUsuario = document.getElementById("inputFiltroUsuario");
inputFiltroUsuario.addEventListener("input", async function () {
  currentPage = 1;
  const URLFilterName = `http://localhost:3000/getFilterUserNameInTech?page=${currentPage}&limit=10`;
  const res = await fetch(URLFilterName, {
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
      process();
    });
});

const inputFiltroCorreo = document.getElementById("inputFiltroCorreo");
inputFiltroCorreo.addEventListener("input", async function () {
  currentPage = 1;
  const URLFilterName = `http://localhost:3000/getFiltereEmailInTech?page=${currentPage}&limit=10`;
  const res = await fetch(URLFilterName, {
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
      process();
    });
});
