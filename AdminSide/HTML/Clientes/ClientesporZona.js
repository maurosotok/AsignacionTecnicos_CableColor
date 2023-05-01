const forChart = "http://localhost:3000/getClienteporZona";

let zonas = [];
addEventListener("DOMContentLoaded", async function () {
  titulo = this.document.querySelector("#titulo");
  const date = new Date();

  day = date.getDate();
  month = "Abril";
  year = date.getFullYear();
  const fecha = month + "/" + day + "/" + year;
  const response = await fetch(forChart, {
    method: "GET",
  })
    .then((response) => response.json())
    .then(function (data) {
      let placeholder = document.querySelector("#data-output");
      let out = "";
      for (let product of data) {
        out += `
            <tr>
                <td>${product.Colonia} </td>  
                <td>${product.YCantidad} </td>
            </tr>
        `;
      }
      placeholder.innerHTML = out;

      titulo.innerHTML = `Clientes por Zona hasta ${fecha}`;
      console.log(data);
      console.log("length ", data.length);

      let etiquetas = [];
      let valores = [];
      let j = 0;
      while (j < data.length) {
        etiquetas[j] = data[j].Colonia;
        valores[j] = data[j].YCantidad;
        j = j + 1;
      }
      console.log("etiquetas", etiquetas);
      console.log("valores", valores);

      //labelss = ["San Carlos", "Puerto Cortes", "Los Laureles", "La Texaco", "Cabañas", "Los Angeles", "Barrio el centro", "La Lopez", "La Sandoval", "La Satelite" ]
      //numbers = [ 14, 1, 3, 1, 1, 5, 3, 3, 3, 2 ]
      const ctx = document.getElementById("myChart");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: etiquetas,
          datasets: [
            {
              label: "# de Clientes",
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
              display: false
            },
            title: {
              display: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
});
