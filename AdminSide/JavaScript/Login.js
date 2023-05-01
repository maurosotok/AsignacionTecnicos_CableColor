const getBtn = document.getElementById("btn_submit");
const usuario = document.getElementById("Username_provided");
const contraseña = document.getElementById("Password_provided");

getBtn.addEventListener("click", postInfo);
// exporting module

const baseUrl = "http://localhost:3000/request";
const postURL = "http://localhost:3000/users";


/*
async function getInfo(event) {
  //Function is for test and to get data from server
  event.preventDefault();
  if (usuario.value == "" || contraseña.value == "") {
    alert("Llene todos los campos");
  }
  const res = await fetch(baseUrl, {
    method: "GET",
  });
  console.log(res);
  const data = await res.json();
  input.value = data.info;
}*/


async function postInfo(event) {

  try {
    event.preventDefault();
  if (usuario.value == "" || contraseña.value == "") {
    alert("Llene todos los campos");
  }
  const res = await fetch(postURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: { Usuario: usuario.value, Clave: contraseña.value },
    }),
  }).catch((error) => {
    console.error(error);
    alert("Inicio de sesión fallido");
  });
  if (res.ok) {
    localStorage.setItem("TechUserID", usuario.value);
    window.location.href = "Perfil.html";
  }
  if (res.status === 400) {
    alert("Usuario o contraseña incorrect, pruebe de nuevo");
  }  
  } catch (error) {
   alert("Hubo un error al inicar sesion, contacte al administrador") 
  }
  
}
