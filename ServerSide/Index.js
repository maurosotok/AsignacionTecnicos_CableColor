import express from "express";
import cors from "cors";
import {
  postUsers,
  getUsuarios,
  getTecnicosDisponibles,
  getClientes,
  postClientes,
  getVistaVisitas,
  getTecnicos,
  postClienteSeleccionado,
  ActualizarCliente,
  DesactivarCliente,getVistaVisitasPreviw,
  TecnicoSeleccionado,
  CrearVisita,
  VerClientesActivos,
  getTecnicoUnico,
  VisitasPendientes,
  getServicioPorZona,
  getClientesActivosPendientes,
  getClienteporZona,
  orderbyCliente,
  getColonias,
  TechUsers,
  getZonasUnicas,
  getMejoresTecnicos,
  crearTecnico,
  getServicioPorTecnico,
  getServicioSolicitado,
  getFilterNameInCliente,
  getFilterIdentidadInCliente,
  orderbyTecnico,
  getFilterColoniaInCliente,
  crearCliente,
  getFilterEstadoInCliente,
  postTecnicoSeleccionado,
  ActualizarTecnico,
  getFilterUserNameInTech,
  getFilterNameInTech,
  VisitaSeleccionada,
  ActualizarVisita,
  orderbyVista,
  CompletarVisitaTecnico,
  getFiltereEmailInTech,
  getFilterNameInVisita,
  getFilterColoniaInVisita,
  getFilterServicioInVisita,
  getFiltereEstadoInTech,
  getTecnicosForEdit,
  getFilterTechInVisita,
  getFilterEstadoInVisita,
  tecnicosCombo,
  getVisitafromTecnico,
  gettecnicosDisponiblesCombo,
} from "./Index.controllers.js";

const app = express();
app.use(express.json());
app.use(cors());
app.get('/getVistaVisitasPreviw', getVistaVisitasPreviw)
app.get("/gettecnicosDisponiblesCombo", gettecnicosDisponiblesCombo);
app.post("/crearCliente", crearCliente);
app.get("/tecnicosCombo", tecnicosCombo);
app.get("/VisitasPendientes", VisitasPendientes);
app.get("/getServicioSolicitado", getServicioSolicitado);
app.post("/getServicioPorTecnico", getServicioPorTecnico);
app.get("/getMejoresTecnicos", getMejoresTecnicos);
app.get("/getClienteporZona", getClienteporZona);
app.get("/ZonasUnicas", getZonasUnicas);
app.post("/getServicioPorZona", getServicioPorZona);
app.post("/CrearVisita", CrearVisita);
app.post("/users", postUsers);
app.post("/TechUsers", TechUsers);
app.post("/usuarios", getUsuarios);
app.get("/Tecnicos", getTecnicos);
app.get("/getTecnicosForEdit", getTecnicosForEdit);
app.post("/crearTecnico", crearTecnico);
app.post("/postTecnicoSeleccionado", postTecnicoSeleccionado);
app.post("/getTecnicoUnico", getTecnicoUnico);
app.get("/getColonias", getColonias);
app.post("/ActualizarTecnico", ActualizarTecnico);
app.get("/tecnicosDisponibles", getTecnicosDisponibles);
app.get("/clientes", getClientes);
app.post("/ClienteSeleccionado", postClienteSeleccionado);
app.post("/ActualizarCliente", ActualizarCliente);
app.post("/DesactivarCliente", DesactivarCliente);
app.get("/VerClientesActivos", VerClientesActivos);
app.get("/VistaVisitas", getVistaVisitas);
app.post("/IngresoCliente", postClientes);
app.get("/getClientesActivosPendientes", getClientesActivosPendientes);
app.post("/TecnicoSeleccionado", TecnicoSeleccionado);
app.post("/VisitaSeleccionada", VisitaSeleccionada);
app.post("/ActualizarVisita", ActualizarVisita);
app.post("/getVisitafromTecnico", getVisitafromTecnico);
//order by

app.post("/orderbyCliente", orderbyCliente);
app.post("/orderbyTecnico", orderbyTecnico);
app.post("/orderbyVista", orderbyVista);

// filters
app.post("/getFilterName", getFilterNameInCliente);
app.post("/getFilterIdentidadInCliente", getFilterIdentidadInCliente);
app.post("/getFilterEstadoInCliente", getFilterEstadoInCliente);
app.post("/getFilterColoniaInCliente", getFilterColoniaInCliente);

app.post("/getFilterUserNameInTech", getFilterUserNameInTech);
app.post("/getFilterNameInTech", getFilterNameInTech);
app.post("/getFiltereEmailInTech", getFiltereEmailInTech);
app.post("/getFiltereEstadoInTech", getFiltereEstadoInTech);

app.post("/getFilterNameInVisita", getFilterNameInVisita);
app.post("/getFilterColoniaInVisita", getFilterColoniaInVisita);
app.post("/getFilterServicioInVisita", getFilterServicioInVisita);
app.post("/getFilterTechInVisita", getFilterTechInVisita);
app.post("/getFilterEstadoInVisita", getFilterEstadoInVisita);
app.post("/getVisitafromTecnico", getVisitafromTecnico);

app.post('/CompletarVisitaTecnico', CompletarVisitaTecnico)
app.listen(3000);
