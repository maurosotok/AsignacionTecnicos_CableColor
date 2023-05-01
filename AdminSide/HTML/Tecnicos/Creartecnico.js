const btnCrear = document.getElementById("btnCrear");
const inputName = document.getElementById("inputName");
const inputUserName = document.getElementById("inputUserName");
const inputemail = document.getElementById("inputemail");
const inputPassword = document.getElementById("inputPassword");
const inputPasswordCheck = document.getElementById("inputPasswordCheck");
const postURL = "http://localhost:3000/crearTecnico";
const pop = document.getElementById("popup")

popup.addEventListener("click", function () {
  popup.classList.remove("open-popup");
  location.reload();
});
btnCrear.addEventListener("click", async () => {
  try {
    console.log(inputName.value.length)

    const regex = /\d/; // The \d represents any digit
    if(inputName.value.length < 7){
      alert("Ingresa un nombre mas largo")
    }else if(inputUserName.value.length <8){
      alert("Ingresa un nombre de usuario mas largo")
    }else if(inputPassword.value.length < 9){
      alert("Ingresa una contraseña mas larga")
    }else if (regex.test(inputName.value) == true) {
      alert("No se permiten numeros");
    }
    else if(inputUserName.value.includes('.') == false ||inputUserName.value.trim().includes(' ') == true ){
      alert("Usuario invalido")
    }else if(inputemail.value.includes('@') == false || inputemail.value.includes('.hn') == false || inputemail.value.includes(' ') == true ){
      alert("Correo electronico no valido")
      }
    else if (inputPassword.value != inputPasswordCheck.value) {
      alert("Contraseñas son diferentes");
    }else if(inputPassword.value.includes(' ') == true){
      alert("Contraseña no valida")
    }
     else {
      const res = await fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //parcel: [inputNombre.value, inputDireccion.value, inputColonia.value, inputReferencia.value, inputTelefono.value, inputIdentidad.value, Estado]
          parcel: {
            Nombre: inputName.value,
            Usuario: inputUserName.value.trim(),
            Correo: inputemail.value.trim(),
            Pass: inputPassword.value,
          },
        }),
        
      }).catch((error) => {
        console.error(error);
        alert("Hubo un error al mandar los datos");
      });
      pop.classList.add("open-popup");
      inputName.value = ""
      inputUserName.value = ""
      inputemail.value = ""
      inputPassword.value = ""
     // inputPasswordCheck = ""
    }
  } catch (error) {
    console.log(error);
  }
 
});
