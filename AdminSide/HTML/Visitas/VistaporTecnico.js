let currentPage = 1;
let flagfilter = false;
let titletochange = document.querySelector("#Titulo");
const getTecnicos = `http://localhost:3000/Tecnicos?page=${currentPage}&limit=10`;
const postUrlTech = "http://localhost:3000/TecnicoSeleccionado";
const btnResetear = document.getElementById("btnReset");
const tabla = document.getElementById("TablaTecnicos");

let fechaSelected = null;
btnResetear.addEventListener("click", function () {
  location.reload();
});
const rows = tabla.getElementsByTagName("tr");
let Datos = {
  TecnicoID: null,
  Nombre: null,
  Disponibilidad: null,
};

ComboFecha = document.getElementById("DateDropdown");
const date = new Date();

day = date.getDate();
month = "Abril";
year = date.getFullYear();

let meses = ["Enero "+ year, "Febrero "+year, "Marzo "+year, "Abril "+year, "Mayo "+year, "Junio "+year, "Julio "+year, "Agosto "+year, "Septiembre "+year, "Octubre "+year, "Noviembre "+year, "Diciembre "+year];

addEventListener("DOMContentLoaded", async function () {
  for (let i = 0; i < meses.length; i++) {
    const option = document.createElement("option");
    option.value = meses[i];
    option.text = meses[i];
    ComboFecha.appendChild(option);
  }
  const res = await this.fetch(getTecnicos)
    .then(function (res) {
      return res.json();
    })
    .then(function (vista) {
      let placeholder = document.querySelector("#TechOutput");
      let out = "";
      for (let product of vista.results) {
        out += `
            <tr>
                <td>${product.TecnicoID} </td>
                <td>${product.NombreTec} </td>
                <td>${product.Disponibilidad} </td>
            </tr>
        `;
      }
      placeholder.innerHTML = out;
      process();
    });
});
async function sortTable(columnIndex) {
  flagfilter = true;
  columnSelected = columnIndex;
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

      let placeholder = document.querySelector("#TechOutput");
      let out = "";
      for (let product of data.results) {
        out += `
            <tr>
                <td>${product.TecnicoID} </td>
                <td>${product.NombreTec} </td>
                <td>${product.Disponibilidad} </td>
            </tr>
        `;
      }
      placeholder.innerHTML = out;
      process();
    });
}

const inputFiltroTecnico = document.getElementById("inputFiltroTecnico");

inputFiltroTecnico.addEventListener("input", async function () {
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
        let place = document.querySelector("#TechOutput");
        console.log(data);
        let fromSelectedRow = "";

        for (let product of data.results) {
          fromSelectedRow += `
          <tr>
          <td>${product.TecnicoID} </td>
          <td>${product.NombreTec} </td>
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
    let place = document.querySelector("#TechOutput");
    fromSelectedRow += `<tr class="row">
          
        </tr>`;
    place.innerHTML = fromSelectedRow;
  }
});

ComboFecha.addEventListener("change", function () {
  console.log(ComboFecha.selectedIndex)
  fechaSelected = ComboFecha.selectedIndex
  let messeleccionado = this.value;
  titletochange.innerHTML = `Visitas por Tecnico | ${messeleccionado}`;
});

async function process() {
  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener("click", async function () {
      const cells = this.getElementsByTagName("td");
      Datos.TecnicoID = cells[0].innerHTML;
      Datos.Nombre = cells[1].innerHTML;
      Datos.Disponibilidad = cells[2].innerHTML;
      const res = await fetch(postUrlTech, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parcel: {
            TecnicoID: Datos.TecnicoID,
            FechaSeleccionada: fechaSelected,
          },
        }),
      })
        .then((response) => response.json())
        .then(function (data) {
          let place = document.querySelector("#TechOutput");
          let selectedRow = "";

          selectedRow = `<tr>
                 <td>${Datos.TecnicoID} </td>
                 <td>${Datos.Nombre} </td>
                 <td>${Datos.Disponibilidad} </td>
           </tr>`;
          place.innerHTML = selectedRow;

          let placeholder = document.querySelector("#VisitOutput");
          let fromSelectedRow = "";
          for (let producto of data) {
            let fechaString = producto.FechaVisita;
            const fecha = new Date(fechaString);
            const opciones = {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            };
            const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);

            fromSelectedRow += `<tr class="row">
              <td>${producto.IDVisita} </td>
              <td>${producto.NombreCliente} </td>
              <td>${producto.Colonia} </td>
              <td id="date">${fechaFormateada}</td>
              <td>${producto.Servicio} </td>
          </tr>`;
          }
          placeholder.innerHTML = fromSelectedRow;

          ComboFecha.addEventListener("change", async function () {
            let messeleccionado = this.value;
            titletochange.innerHTML = `Visitas por Tecnico | ${messeleccionado}, 2023`;
            
            fechaSelected = ComboFecha.selectedIndex
            console.log("hola")
            console.log(fechaSelected);
            const respon = await fetch(postUrlTech, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                parcel: {
                  TecnicoID: Datos.TecnicoID,
                  FechaSeleccionada: fechaSelected,
                },
              }),
            })
              .then((respon) => respon.json())
              .then(function (datoss) {
                let place = document.querySelector("#TechOutput");

                let selectedRow = "";

                selectedRow = `<tr>
                 <td>${Datos.TecnicoID} </td>
                 <td>${Datos.Nombre} </td>
                 <td>${Datos.Disponibilidad} </td>
           </tr>`;
                place.innerHTML = selectedRow;

                let placeholder = document.querySelector("#VisitOutput");
                let fromSelectedRow = "";
                for (let producto of datoss) {
                  let fechaString = producto.FechaVisita;
                  const fecha = new Date(fechaString);
                  const opciones = {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  };
                  const fechaFormateada = fecha.toLocaleDateString(
                    "es-ES",
                    opciones
                  );

                  fromSelectedRow += `<tr class="row">
              <td>${producto.IDVisita} </td>
              <td>${producto.NombreCliente} </td>
              <td>${producto.Colonia} </td>
              <td id="date">${fechaFormateada}</td>
              <td>${producto.Servicio} </td>
          </tr>`;
                }
                placeholder.innerHTML = fromSelectedRow;
                titletochange.innerHTML = `Visitas | ${messeleccionado}, 2023`;
              });
          });
        });
    });
  }
}

const btnNext = document.getElementById("btnNext");

btnNext.addEventListener("click", () => {
  //const getTecnicos = `http://localhost:3000/Tecnicos?page=${currentPage}&limit=10`
  if (flagfilter == true) {
    currentPage = currentPage + 1;
    sortTable(columnSelected);
  } else {
    currentPage = currentPage + 1;
    let getTecnicos1 = `http://localhost:3000/Tecnicos?page=${currentPage}&limit=10`;
    fetch(getTecnicos1)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#TechOutput");
        let out = "";
        for (let product of vista.results) {
          out += `
            <tr>
                <td>${product.TecnicoID} </td>
                <td>${product.NombreTec} </td>
                <td>${product.Disponibilidad} </td>
            </tr>
        `;
        }
        placeholder.innerHTML = out;
        process();
      });
  }
});


const btnPrev = document.getElementById("btnPrev")
btnPrev.addEventListener("click", () => {


  if (currentPage == 1) {
  } else if (flagfilter == true) {
    currentPage = currentPage - 1;
    sortTable(columnSelected)
  }
  else {
    currentPage = currentPage - 1;
    let getTecnicos1 = `http://localhost:3000/Tecnicos?page=${currentPage}&limit=10`;
    fetch(getTecnicos1)
      .then(function (res) {
        return res.json();
      })
      .then(function (vista) {
        let placeholder = document.querySelector("#TechOutput");
        let out = "";
        for (let product of vista.results) {
          out += `
            <tr>
                <td>${product.TecnicoID} </td>
                <td>${product.NombreTec} </td>
                <td>${product.Disponibilidad} </td>
            </tr>
        `;
        }
        placeholder.innerHTML = out;
        process();
      });
  }
});