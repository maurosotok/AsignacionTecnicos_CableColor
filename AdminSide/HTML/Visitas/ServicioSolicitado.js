getVisitasUrl = "http://localhost:3000/getServicioSolicitado";

fetch(getVisitasUrl)
  .then(function (res) {
    return res.json();
  })
  .then(function (vista) {
    let placeholder = document.querySelector("#data-output");
    let out = "";
    for (let product of vista) {
      out += `
            <tr>
                <td>${product.ServicioSolicitado} </td>  
                <td>${product.Cantidad} </td>
            </tr>
        `;
    }
    placeholder.innerHTML = out;
   
      const titulo = document.querySelector("#title")
      const date = new Date();

      day = date.getDate();
      month = "Abril";
      year = date.getFullYear();
      //const fecha = month + "/" + day + "/" + year;
      titulo.innerHTML = `Servicio mas solicitado y no disponible en ${year}`;

      let etiquetas = [];
      let valores = [];
      let j = 0;
      while (j < vista.length) {
        etiquetas[j] = vista[j].ServicioSolicitado;
        valores[j] = vista[j].Cantidad;
        j = j + 1;
      }
     
      
      labelss = ["San Carlos", "Puerto Cortes", "Los Laureles", "La Texaco", "Cabañas", "Los Angeles", "Barrio el centro", "La Lopez", "La Sandoval", "La Satelite" ]
      numbers = [ 14, 1, 3, 1, 1, 5, 3, 3, 3, 2 ]
      const ctx = document.getElementById('myChart');

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: etiquetas,
          datasets: [{
            label: '# de Clientes',
            data: valores,
            borderWidth: 1,
            backgroundColor: ['rgba(60, 179, 113,0.6)', 'rgba(255, 165, 0,0.6)', 'rgba(255, 0, 0,0.6)', 'rgba(6, 141, 255,0.6)', 'rgba(238, 130, 238,0.6)', 'rgba(6, 255, 152,0.6)', 'rgba(6, 169, 255,0.6)', 'rgba(106, 90, 205,0.6)', 'rgba(172, 60, 255,0.6)','rgba(0, 255, 0,0.6)']
          }]
        },
        
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            },
            
          }
        }
      });

  });


