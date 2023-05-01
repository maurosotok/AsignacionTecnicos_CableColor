const getBtn = document.getElementById("btn_submit");
const usuario = document.getElementById("Username_provided");
const contraseña = document.getElementById("Password_provided");

getBtn.addEventListener("click", postInfo);



const postURL = "http://localhost:3000/TechUsers";


async function postInfo(event) {
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
    
    localStorage.setItem("UserID", usuario.value);
    window.location.href = "PerfilTecnico.html";
  }
  if (res.status === 400) {
    alert("Usuario o contraseña incorrect, pruebe de nuevo");
  }
}
