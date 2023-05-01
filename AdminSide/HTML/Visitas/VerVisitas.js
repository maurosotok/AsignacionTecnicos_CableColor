let currentPage = 1;
//let flagcombo = false
let columnSelected = null;
let flagfilter = false // getVistaVisitasPreviw;
let comboestado = null
const getVisitasUrl = `http://localhost:3000/VistaVisitas?page=${currentPage}&limit=10`;
//const cb = document.getElementById("OnlyPendings");
const Visitapendiente = `http://localhost:3000/VisitasPendientes?page=${currentPage}&limit=10`;
let estados = ["Completado", "Pendiente", "Descartada"];

const ComboStatus = document.getElementById("StatusDropdown");


addEventListener("DOMContentLoaded", async function () {

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
      let titulo = document.querySelector("#title");
      let out = "";
      for (let product of vista.results) {
        let fechaString = product.FechaVisita;
        const fecha = new Date(fechaString);
        const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
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
      const date = new Date();
      day = date.getDate();
      month = "Abril";
      year = date.getFullYear();
      const fecha = month + "/" + day + "/" + year;
      titulo.innerHTML = `Visitas a ${fecha}`;
    });
});
let flagcombo = false
//let comboestado = ""
ComboStatus.addEventListener("change", function (){
  flagcombo = true
  comboestado = this.value

  try {
    comboestado = this.value
    currentPage = 1;
    const URLFilterName1 = `http://localhost:3000/getFilterEstadoInVisita?page=${currentPage}&limit=10`;
    let valor = this.value.trim().toLowerCase();

    procesofiltro(URLFilterName1, valor);
  } catch (error) {
    let fromSelectedRow = "";
    let place = document.querySelector("#data-output");
    fromSelectedRow += `<tr class="row">
                
              </tr>`;
    place.innerHTML = fromSelectedRow;
  }
})

/*
cb.addEventListener("change", function () {
  if (cb.checked == false) {
    const res = fetch(getVisitasUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#data-output");
        let titulo = document.querySelector("#title");
        let out = "";

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
            <td>${product.NombreCliente} </td>
            <td>${product.Direccion} </td>
            <td>${product.Colonia} </td>
            <td>${product.Servicio} </td>
            <td id="date">${fechaFormateada}</td>
            <td>${product.NombreTec} </td>
          </tr>
        `;
        }
        placeholder.innerHTML = out;
        const date = new Date();
        day = date.getDate();
        month = "Abril";
        year = date.getFullYear();
        const fecha = month + "/" + day + "/" + year;
        titulo.innerHTML = `Visitas a ${fecha}`;
      });
  }
  if (cb.checked == true) {
    const res = fetch(Visitapendiente)
      .then(function (res) {
        return res.json();
      })
      .then(function (view) {
        let nuevoph = document.querySelector("#data-output");
        let titulo = document.querySelector("#title");

        let nuevoout = "";
        for (let product of view.results) {
          let fechaString = product.FechaVisita;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
          nuevoout += `
          <tr>
            <td>${product.IDVisita} </td>   
            <td>${product.NombreCliente} </td>
            <td>${product.Direccion} </td>
            <td>${product.Colonia} </td>
            <td>${product.Servicio} </td>
            <td id="date">${fechaFormateada}</td>
            <td>${product.NombreTec} </td>
          </tr>
            `;
        }
        nuevoph.innerHTML = nuevoout;
        const date = new Date();

        day = date.getDate();
        month = "Abril";
        year = date.getFullYear();
        const fecha = month + "/" + day + "/" + year;
        titulo.innerHTML = `Visitas Pendientes  ${fecha}`;
      });
  }
});*/

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
     // process()
    });
}

btnNext.addEventListener("click", () => {
  if (flagfilter == true) {
    currentPage = currentPage + 1;
    sortTable(columnSelected)   
}else if(ComboStatus.value == "Completado"){
  currentPage = currentPage + 1;
  const URLFilterName1 = `http://localhost:3000/getFilterEstadoInVisita?page=${currentPage}&limit=10`;
  procesofiltro(URLFilterName1, comboestado)

}else if(ComboStatus.value == "Pendiente"){
  currentPage = currentPage + 1;
  const URLFilterName1 = `http://localhost:3000/getFilterEstadoInVisita?page=${currentPage}&limit=10`;
  procesofiltro(URLFilterName1, comboestado)
}else if(ComboStatus.value == "Descartada"){
  currentPage = currentPage + 1;
  const URLFilterName1 = `http://localhost:3000/getFilterEstadoInVisita?page=${currentPage}&limit=10`;
  procesofiltro(URLFilterName1, comboestado)
}else{
  currentPage = currentPage + 1;
  getVisitasUrl1 = `http://localhost:3000/VistaVisitas?page=${currentPage}&limit=10`;
  fetch(getVisitasUrl1)
    .then(function (res) {
      return res.json();
    })
    .then(function (vista) {
      let placeholder = document.querySelector("#data-output");
      let out = "";
      
      for (let product of vista.results) {
        let fechaString = product.FechaVisita;
        const fecha = new Date(fechaString);
        const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
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
      //process();
    });
}

  
});


document.getElementById("btnReset").addEventListener("click", ()=>{location.reload()
  
})
btnPrev.addEventListener("click", () => {
  if (currentPage == 1) {
  } else if (flagfilter == true) {
    currentPage = currentPage - 1;
    sortTable(columnSelected)
  }else if(flagcombo == true){
    currentPage = currentPage - 1;
    const URLFilterName1 = `http://localhost:3000/getFilterEstadoInVisita?page=${currentPage}&limit=10`;
    procesofiltro(URLFilterName1, comboestado);
  }else {
    currentPage = currentPage - 1;
    let getVisitasUrl2 = `http://localhost:3000/VistaVisitas?page=${currentPage}&limit=10`;
    fetch(getVisitasUrl2)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#data-output");
        let out = "";
        
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
        //process();
      });
  }
});


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


