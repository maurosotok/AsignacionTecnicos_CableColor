getVisitasUrl = "http://localhost:3000/getMejoresTecnicos";

fetch(getVisitasUrl)
  .then(function (res) {
    return res.json();
  })
  .then(function (vista) {
    const title = document.getElementById("title")

    let placeholder = document.querySelector("#data-output");
    let out = "";
    for (let product of vista) {
      out += `
            <tr>
                <td>${product.NombreTec} </td>  
                <td>${product.Responses} </td>
                <td>${product.Stella} </td>
            </tr>
        `;
    }
    placeholder.innerHTML = out;
    const date = new Date();
    year = date.getFullYear();
    
    title.innerHTML = `Top 3 Mejores Tecnicos en ${year}`;

    let etiquetas = [];
    let valores = [];
    let j = 0;
    while (j < vista.length) {
      etiquetas[j] = vista[j].NombreTec;
      valores[j] = vista[j].Stella;
      j = j + 1;
    }
    console.log("etiquetas", etiquetas);
    console.log("valores", valores);

    labelss = [
      "San Carlos",
      "Puerto Cortes",
      "Los Laureles",
      "La Texaco",
      "Cabañas",
      "Los Angeles",
      "Barrio el centro",
      "La Lopez",
      "La Sandoval",
      "La Satelite",
    ];
    numbers = [14, 1, 3, 1, 1, 5, 3, 3, 3, 2];
    const ctx = document.getElementById("myChart");

    new Chart(ctx, {
      type: "doughnut",
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
        scales: {
          y: {
            beginAtZero: true,
            //display: false
          },
        },
      },
    });
  });
