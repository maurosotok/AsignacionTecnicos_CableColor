const inputNombre = document.getElementById("LbNombreCliente");
const inputDireccion = document.getElementById("LbDireccion");
const inputColonia = document.getElementById("LbColonia");
const inputReferencia = document.getElementById("LbReferencia");
const inputTelefono = document.getElementById("LbTelefono");
const inputIdentidad = document.getElementById("LbIdentidad");
const postURL = "http://localhost:3000/crearCliente"
const btnCreate = document.getElementById("Confirm")

btnCreate.addEventListener('click', async ()=>{
    const res = await fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //parcel: [inputNombre.value, inputDireccion.value, inputColonia.value, inputReferencia.value, inputTelefono.value, inputIdentidad.value, Estado]
          parcel: {
            Nombre: inputNombre.value.trim(),
            Direccion: inputDireccion.value.trim(),
            Colonia: inputColonia.value.trim(),
            Referencia: inputReferencia.value.trim(),
            Telefono: inputTelefono.value.trim(),
            Identidad: inputIdentidad.value.trim(),
          },
        }),
      }).catch((error) => {
        console.error(error);
        alert("Hubo un error al mandar los datos");
      });
      if (res.ok) {
        inputNombre.value = "";
        inputDireccion.value = "";
        inputColonia.value = "";
        inputReferencia.value = "";
        inputTelefono.value = "";
        inputIdentidad.value = "";
        inputaño.value = "";
        inputmes.value = ""
        inputdia.value = ""
  
        popup.classList.add("open-popup");
      }
      if (res.status === 400) {
        alert("Usuario o contraseña incorrect, pruebe de nuevo");
      }
} )




