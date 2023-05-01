const urlGetTecnicos = "http://localhost:3000/tecnicosCombo";
const ComboZona = document.getElementById("TechDropdown");
const forChart = "http://localhost:3000/getServicioPorTecnico";
let zonas = [];

addEventListener("DOMContentLoaded", async function () {
  const res = await fetch(urlGetTecnicos, {
    method: "GET",
  });
  zonas = await res.json();

  for (let i = 0; i < zonas.length; i++) {
    const option = document.createElement("option");
    option.value = zonas[i].NombreTec;
    option.text = zonas[i].NombreTec;
    ComboZona.appendChild(option);
  }
});

ComboZona.addEventListener("change", async function () {
  selectedZone = this.value;

  for (let j = 0; j < zonas.length; j++) {
    if (zonas[j].NombreTec == selectedZone) {
      selectedIDTech = zonas[j].TecnicoID;
      console.log(selectedIDTech, "jj");
    }
  }
  const res = await fetch(forChart, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: {
        Zona: selectedZone,
        IDTec: selectedIDTech,
      },
    }),
  })
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      console.log("length ", data.length);
      let placeh = document.querySelector("#TitleOutPut");

      let insideTitle = "";
      insideTitle = `<tr>
      <th>Servicio</th>
      <th>Completado</th>
    </tr>`;
      placeh.innerHTML = insideTitle;

      let placeholder = document.querySelector("#data-output");
      let out = "";
      for (let product of data) {
        out += `
            <tr>
                <td>${product.Servicio} </td>  
                <td>${product.YCantidad} </td>
            </tr>
        `;
      }
      placeholder.innerHTML = out;

      let etiquetas = [];
      let valores = [];
      let j = 0;
      while (j < data.length) {
        etiquetas[j] = data[j].Servicio;
        valores[j] = data[j].YCantidad;
        j = j + 1;
      }
      const config = {
        type: "bar",

        data: {
          labels: etiquetas,
          datasets: [
            {
              data: valores,
              borderWidth: 1,
              backgroundColor: [
                "rgba(60, 179, 113,0.6)",
                "rgba(255, 165, 0,0.6)",
                "rgba(255, 0, 0,0.6)",
                "rgba(6, 141, 255,0.6)",
                "rgba(238, 130, 238,0.6)",
                "rgba(6, 255, 152,0.6)",
                "rgba(6, 169, 255,0.6)",
                "rgba(106, 90, 205,0.6)",
                "rgba(172, 60, 255,0.6)",
                "rgba(0, 255, 0,0.6)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              display: false,
            },
            title: {
              display: true,
            },
          },
        },
      };
      var myChart = new Chart(
        document.getElementById("myChart").getContext("2d"),
        config
      );
    });
  myChart.classList.add("cuadro");
  if (myChart.chart) {
    // If there is, destroy the chart instance
    myChart.chart.destroy();
  }
  const titulo = document.querySelector("#titulo");
  const date = new Date();

  day = date.getDate();
  month = "Abril";
  year = date.getFullYear();
  const fecha = month + "/" + day + "/" + year;
  titulo.innerHTML = `Servicio por Tecnico hasta ${fecha}`;

  /*  const response = await fetch(forChart, {
    method: "GET",
  });*/
});
