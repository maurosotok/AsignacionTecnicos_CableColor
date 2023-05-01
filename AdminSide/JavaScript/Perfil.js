const urlUsers = "http://localhost:3000/usuarios";
window.addEventListener("DOMContentLoaded", async () => {
  const name = localStorage.getItem("TechUserID");
  console.log(name);
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

      console.log(data);
      document.getElementById("ID").innerHTML = data[0].ID;
      document.getElementById("email").innerHTML = data[0].Emailaddress;
      document.getElementById("Tenure").innerHTML = fechaFormateada;
      document.getElementById("Name").innerHTML = data[0].Nombre;
      document.getElementById("Username").innerHTML = data[0].UserName;
      document.getElementById("Phone").innerHTML = data[0].Telefono;
    });
});
