const ComboTecnico = document.getElementById("TechDropdown");
const ComboClientes = document.getElementById("CustomerDropdown")
const getUrlClientes = 'http://localhost:3000/clientes'
const getURLTecnicos = 'http://localhost:3000/tecnicos'
let tecnicos = []
let clientes = []

ComboClientes.addEventListener("change", function(){
  const selectedCustomer = this.value
  console.log("El usuario selecciono cliente: "+selectedCustomer)
})


ComboTecnico.addEventListener("change", function() {
    const selectedValue = this.value;
    console.log("El usuario seleccionó la opción: " + selectedValue);
});
addEventListener('DOMContentLoaded', async function(event) {
    
  const res = await fetch (getURLTecnicos, {
    method: 'GET'
  })
  tecnicos = await res.json()
  
  const response = await fetch (getUrlClientes, {
    method: 'GET'
  })
  clientes = await response.json()
  
  for (let i = 0; i < clientes.length; i++) {
    const option = document.createElement("option");
    option.value = clientes[i].Nombre;
    option.text = clientes[i].Nombre;
    ComboClientes.appendChild(option);
  }
  for (let i = 0; i < tecnicos.length; i++) {
    const option = document.createElement("option");
    option.value = tecnicos[i].UserName;
    option.text = tecnicos[i].UserName;
    ComboTecnico.appendChild(option);
  }
})
