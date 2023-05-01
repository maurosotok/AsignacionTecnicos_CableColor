const urlUsers = "http://localhost:3000/getTecnicoUnico";
window.addEventListener("DOMContentLoaded", async () => {
  const name = localStorage.getItem("UserID");
  console.log(name)
  document.getElementById("Username").innerHTML = name;
  const res = await fetch(urlUsers, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: {
        ID: name,
      },
    }),
  })
    .then((response) => response.json())
    .then(function (data) {

        let fechaString = data[0].Tenure;
          const fecha = new Date(fechaString);
          const opciones = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          };
          const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
      

      document.getElementById("ID").innerHTML = data[0].TecnicoID;
      document.getElementById("email").innerHTML = data[0].Emailaddress;
      document.getElementById("Tenure").innerHTML = fechaFormateada;
      document.getElementById("Name").innerHTML = data[0].NombreTec;
      document.getElementById("Username").innerHTML = data[0].UserName;
      document.getElementById("Estado").innerHTML = data[0].Disponibilidad;

    });
});
