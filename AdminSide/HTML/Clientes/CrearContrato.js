const inputNombre = document.getElementById("LbNombreCliente");
const ComboTecnico = document.getElementById("TechDropdown");
const inputDireccion = document.getElementById("LbDireccion");
const inputColonia = document.getElementById("LbColonia");
const inputReferencia = document.getElementById("LbReferencia");
const inputTelefono = document.getElementById("LbTelefono");
const label = document.getElementById("Labeled");
const inputIdentidad = document.getElementById("LbIdentidad");
const btnInput = document.getElementById("Confirm");
const inputdia = document.getElementById("day");
const inputmes = document.getElementById("month");
const inputaño = document.getElementById("year");

let popup = document.getElementById("popup");

let tecnicos = [];
let selectedTech = null;
const Estado = "Pendiente";
const postURL = "http://localhost:3000/IngresoCliente";
const getURLTecnicos = "http://localhost:3000/gettecnicosDisponiblesCombo";
const getColonias = "http://localhost:3000/getColonias";

let selectedIDTech = 0;

ComboTecnico.addEventListener("change", function () {
  selectedTech = this.value;
  console.log(selectedTech);
  for (let j = 0; j < tecnicos.length; j++) {
    if (tecnicos[j].NombreTec == selectedTech) {
      selectedIDTech = tecnicos[j].TecnicoID;
    }
  }
});

const ComboColonia = document.getElementById("options");

popup.addEventListener("click", function () {
  popup.classList.remove("open-popup");
  location.reload();
});
btnInput.addEventListener("click", postInfo);

async function postInfo(event) {
  try {
    event.preventDefault();
    const regex = /\d/; // The \d represents any digit
    const date = new Date();
    day = date.getDate();
    month = 4;
    year = date.getFullYear();
    const fecha = month + "/" + day + "/" + year;
    
    if (
      ComboTecnico.selectedIndex == 0 ||
      inputaño.value == "--" ||
      inputmes.value == "--" ||
      inputdia.value == "--" ||
      inputNombre.value == "" ||
      inputDireccion.value == "" ||
      inputReferencia.value == "" ||
      inputDireccion.value == "" ||
      inputIdentidad.value == ""
    ) {
      alert("Por favor llene todos los campos");
    }else if(inputNombre.value.length <8){
      alert("Ingresa un nombre mas largo")
    } 
    else if(inputDireccion.value.length <8){
      alert("Ingresa una direccion mas larga")
    } 
    else if(inputReferencia.value.length <8){
      alert("Ingresa una referencia mas larga")
    } 
    else if(inputTelefono.value.length <9){
      alert("Ingresa un numero de telefono mas largo")
    } 
    else if(inputIdentidad.value.length <8){
      alert("Ingresa una identidad mas largo")
    } 
    else if (regex.test(inputNombre.value) == true) {
      alert("No se permiten numeros");
    } else if (inputaño.value > 2025 || inputaño.value < 2023) {
      alert("Ingrese un año valido");
    } else if (inputmes.value > 12) {
      alert("Ingrese un mes valido");
    } else if (inputdia.value > 31) {
      alert("Ingrese un dia valido");
    } else if (ComboColonia.selectedIndex == 0) {
      alert("Tiene que seleccionar una colonia");
    } else if (
      (inputmes.value == 4 ||
        inputmes.value == 6 ||
        inputmes.value == 9 ||
        inputmes.value == 11) &&
      inputdia.value == 31
    ) {
      alert("Este mes no tiene 31 dias");
    } else if (inputmes.value == 2 && inputdia.value > 29) {
      alert("Este mes no tiene mas de 29 dias");

    } else if(inputdia.value < day && inputmes.value == month){
      alert("Ingrese un dia valido")
    }else if(inputmes.value < month){
      alert("Ingrese un mes valido")
    }
    else {
      console.log(day)
      const fecha =
        inputaño.value + "-" + inputmes.value + "-" + inputdia.value;
      const res = await fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parcel: {
            Nombre: inputNombre.value.trim(),
            Direccion: inputDireccion.value.trim(),
            Colonia: ComboColonia.value.trim(),
            Referencia: inputReferencia.value.trim(),
            Telefono: inputTelefono.value.trim(),
            Identidad: inputIdentidad.value.trim(),
            Estado,
            selectedTech,
            selectedIDTech,
            fecha,
          },
        }),
      }).catch((error) => {
        console.error(error);
        alert("Hubo un error al mandar los datos");
      });
      if (res.ok) {
              inputNombre.value = "";
      inputDireccion.value = "";
      //inputColonia.value = "";
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
    }
  } catch (error) {
    alert("Ha ocurrido un error");
  }
}

coloniasData = [];
addEventListener("DOMContentLoaded", async function () {
  const res = await fetch(getURLTecnicos, {
    method: "GET",
  });
  tecnicos = await res.json();
  for (let i = 0; i < tecnicos.length; i++) {
    const option = document.createElement("option");
    option.value = tecnicos[i].NombreTec;
    option.text = tecnicos[i].NombreTec;
    ComboTecnico.appendChild(option);
  }

  const response = await fetch(getColonias, {
    method: "GET",
  });
  colonias = await response.json();

  for (let i = 0; i < colonias.length; i++) {
    const option = document.createElement("option");
    //console.log(colonias[i].NombreColonia)
    option.value = colonias[i].NombreColonia;
    option.text = colonias[i].NombreColonia;
    coloniasData[i] = colonias[i].NombreColonia;
    ComboColonia.appendChild(option);
  }
  //console.log(coloniasData)
});
