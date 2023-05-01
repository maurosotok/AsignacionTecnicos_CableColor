import { pool } from "./DB.js";

export const TechUsers = async (req, res) => {
  try {
    const verifyPassword = async (password, hashedPassword) => {
      if (password == hashedPassword) return true;
      else return false;
    };
    const { parcel } = req.body;

    const [rows] = await pool.query(
      "select * from tecnicosc where UserName = ?",
      parcel.Usuario
    );

    if (!parcel) {
      return res.status(400).send({ status: "failed" });
    }
    const passwordsMatch = await verifyPassword(
      parcel.Clave,
      rows[0].SavedPassword
    );
    if (passwordsMatch) {
      const data = { message: "OK" };
      return res.status(200).send(data);
    } else {
      return res.status(400).send("Error");
    }
  } catch (error) {
    return res.status(400).send("Error al iniciar sesion");
    //alert("Error al iniciar sesion")
  }
};

export const postUsers = async (req, res) => {
  const verifyPassword = async (password, hashedPassword) => {
    if (password == hashedPassword) return true;
    else return false;
  };

  const { parcel } = req.body;

  const [rows] = await pool.query(
    "select * from adminc where UserName = ?",
    parcel.Usuario
  );
  if (!parcel) {
    return res.status(400).send({ status: "failed" });
  }
  const passwordsMatch = await verifyPassword(
    parcel.Clave,
    rows[0].SavedPassword
  );
  if (passwordsMatch) {
    const data = { message: "OK" };
    return res.status(200).send(data);
  } else {
    return res.status(400).send("Error");
  }
};

export const CrearVisita = async (req, res) => {
  const { parcel } = req.body;

  const fecha = parcel.Year + "-" + parcel.Mes + "-" + parcel.Dia;
  const [Cliente] = await pool.query(
    "select * from Clientes where ClienteID = ?",
    parcel.IDCliente
  );
  const [Tecnico] = await pool.query(
    "Select * from Tecnicos where TecnicoID = ?",
    parcel.IDTec
  );
  const estado = "Pendiente";

  const [rows] = await pool.query(
    "insert into visitas (NombreCliente, Direccion, Colonia, Referencia, Telefono, FechaVisita, Servicio, TecnicoID, NombreTec, Estado, ClienteID) values (?,?,?,?,?,?,?,?,?,?,?)",
    [
      Cliente[0].Nombre.trim(),
      Cliente[0].Direccion.trim(),
      Cliente[0].Colonia.trim(),
      Cliente[0].Referencia.trim(),
      Cliente[0].Telefono.trim(),
      fecha.trim(),
      parcel.Servicio.trim(),
      parcel.IDTec,
      Tecnico[0].NombreTec.trim(),
      "Pendiente",
      parcel.IDCliente,
    ]
  );
  await pool.query(
    "update Clientes set Estado = 'Pendiente' where ClienteID = ?",
    parcel.IDCliente
  );
  await pool.query(
    "Update tecnicos set Disponibilidad = 'Ocupado' where TecnicoID = ?",
    parcel.IDTec
  );
  res.json(rows);
};

export const TecnicoSeleccionado = async (req, res) => {
  const { parcel } = req.body;
  let [rows] = "";

  if (parcel.FechaSeleccionada == null || parcel.FechaSeleccionada == 0) {
    [rows] = await pool.query(
      "Select * from visitas where TecnicoID = ? and estado = 'Completado' order by FechaVisita ASC",
      [parcel.TecnicoID]
    );
  } else {
    [rows] = await pool.query(
      "Select * from visitas where TecnicoID = ? and estado = 'Completado' AND EXTRACT(MONTH FROM FechaVisita) = ? order by FechaVisita ASC",
      [parcel.TecnicoID, parcel.FechaSeleccionada]
    );
  }
  res.json(rows);
};

export const postClienteSeleccionado = async (req, res) => {
  const { parcel } = req.body;
  const [rows] = await pool.query(
    "select * from clientes where ClienteID = ?",
    [parcel.ID]
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Tecnico no encontrado",
    });
  res.json(rows);
};

export const postTecnicoSeleccionado = async (req, res) => {
  const { parcel } = req.body;
  const [rows] = await pool.query(
    "select * from tecnicos where TecnicoID = ?",
    [parcel.ID]
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Tecnico no encontrado",
    });
  res.json(rows);
};

export const VisitasPendientes = async (req, res) => {
  const [rows] = await pool.query(
    "select * from visitas where Estado = 'Pendiente' "
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Vistas no encontrada",
    });

  // res.json(rows);
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getZonasUnicas = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT COUNT(distinct Colonia) as valores, colonia FROM visitas group by colonia"
  );
  if (rows.length < 0) {
    return res.status(400).json({
      message: "Zonas no encontradas",
    });
  }
  res.json(rows);
};

export const getServicioPorZona = async (req, res) => {
  const { parcel } = req.body;
  const [rows] = await pool.query(
    "select count(Servicio) as YCantidad, Servicio from Visitas where Colonia = ? group by Servicio",
    parcel.Zona
  );
  if (rows.length < 0) {
    return res.status(400).json({
      message: "Zonas no encontradas",
    });
  }
  res.json(rows);
};

export const getServicioSolicitado = async (req, res) => {
  const [rows] = await pool.query(
    "select count(ServicioSolicitado) as Cantidad, ServicioSolicitado from encuesta where ServicioSolicitado = 'Soporte técnico para software' or ServicioSolicitado = 'Servicio de Seguridad' or ServicioSolicitado = 'Instalacion de redes' group by ServicioSolicitado order by ServicioSolicitado desc"
  );

  if (rows.length < 0) {
    return res.status(400).json({ message: " No encontrado" });
  }

  res.json(rows);
};

export const getMejoresTecnicos = async (req, res) => {
  const [rows] = await pool.query(
    "select encuesta.NombreTec, count(encuesta.IDTec) AS Responses, format(sum(encuesta.valoracion)/count(encuesta.IDTec), 'P1') as Stella from encuesta inner join tecnicos on tecnicos.tecnicoID = encuesta.IDTEC group by 'Stella', Nombretec order by Stella DESC LIMIT 3"
  );
  if (rows.length < 0) {
    return res.status(400).json({ message: "Encuestas no encontras" });
  }
  res.json(rows);
};
export const getServicioPorTecnico = async (req, res) => {
  const { parcel } = req.body;
  const [rows] = await pool.query(
    "select count(Servicio) as YCantidad, Servicio from Visitas where TecnicoID = ? group by Servicio",
    parcel.IDTec
  );
  if (rows.length < 0) {
    return res.status(400).json({
      message: "Zonas no encontradas",
    });
  }
  res.json(rows);
};

export const getClienteporZona = async (req, res) => {
  const [rows] = await pool.query(
    "select count(Nombre) as YCantidad, Colonia from Clientes where Estado = 'Pendiente' or Estado = 'Activo' group by Colonia order by YCantidad DESC LIMIT 10"
  );
  if (rows.length < 0) {
    return res.status(400).json({
      message: "Zonas no encontradas",
    });
  }
  res.json(rows);
};

export const DesactivarCliente = async (req, res) => {
  const { parcel } = req.body;
  await pool.query(
    "Update clientes set Estado = 'Inactivo' where ClienteID = ?",
    parcel.ID
  );
  const [rows] = await pool.query(
    "select * from clientes where ClienteID = ?",
    parcel.ID
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Tecnico no encontrado",
    });
  res.json(rows);
};
export const VerClientesActivos = async (req, res) => {
  const [rows] = await pool.query(
    "Select * from clientes where Estado = 'Activo'"
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Tecnico no encontrado",
    });
  //  res.json(rows);

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getClientesActivosPendientes = async (req, res) => {
  const [rows] = await pool.query(
    "select * from clientes where (Estado = 'Activo' or Estado = 'Pendiente')"
  );
  if (rows.length <= 0) {
    return res.status(400).json({ message: "Cliente no encontrado" });
  }
  res.json(rows);
};

export const getFilterUserNameInTech = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM tecnicos where UserName LIKE ?",
    values
  );

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Visita no encontrada",
    });

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getFilterNameInTech = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM tecnicos where NombreTec LIKE ?",
    values
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Visita no encontrada",
    });
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getFiltereEmailInTech = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM tecnicos where emailaddress LIKE ?",
    values
  );

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const ActualizarTecnico = async (req, res) => {
  const { parcel } = req.body;

  const [visitaID] = await pool.query(
    "select * from visitas where TecnicoID = ? and Estado = 'Pendiente'",
    parcel.ID
  );
  if (parcel.Estado == "Disponible") {
    if (visitaID.length <= 0) {
      // si no hay visita se cambia
      await pool.query(
        "update tecnicos set Disponibilidad = 'Disponible' where TecnicoID = ?",
        parcel.ID
      );
    } else {
      await pool.query(
        // hay visita, entonces cambia visita

        "update visitas set Estado = 'Completado' where IDVISITA = ?",
        visitaID[0].IDVisita
      );
      await pool.query(
        "update tecnicos set Disponibilidad = 'Disponible' where TecnicoID = ?",
        parcel.ID
      );
    }
  } else if (parcel.Estado == "Desactivado" && parcel.Confirmacion == true) {
    if (visitaID.length > 0) {
      await pool.query(
        "update visitas set Estado = 'Descartada' where IDVISITA = ?",
        visitaID[0].IDVisita
      );
      await pool.query(
        "update tecnicos set Disponibilidad = 'Desactivado' where TecnicoID = ?",
        parcel.ID
      );
      await pool.query(
        "update clientes set Estado = 'Activo' where ClienteID = ?",
        visitaID[0].ClienteID
      );
    } else {
      await pool.query(
        "update tecnicos set Disponibilidad = 'Desactivado' where TecnicoID = ?",
        parcel.ID
      );
    }
  } else if (parcel.Estado == "Ocupado") {
    await pool.query(
      "update tecnicos set Disponibilidad = 'Ocupado' where TecnicoID = ?",
      parcel.ID
    );
  }

  await pool.query("update tecnicos set NombreTec = ? where TecnicoID = ?", [
    parcel.Nombre.trim(),
    parcel.ID,
  ]);
  await pool.query("update tecnicos set UserName = ? where TecnicoID = ?", [
    parcel.Usuario,
    parcel.ID,
  ]);
  await pool.query("update tecnicos set Emailaddress = ? where TecnicoID = ?", [
    parcel.Correo,
    parcel.ID,
  ]);
  const [rows] = await pool.query(
    "select * from tecnicos where TecnicoID = ?",
    parcel.ID
  );
  res.json(rows);
};

export const ActualizarCliente = async (req, res) => {
  const { parcel } = req.body;
  await pool.query("update clientes set Nombre = ? where ClienteID = ?", [
    parcel.Nombre,
    parcel.ID,
  ]);
  await pool.query("update clientes set Direccion = ? where ClienteID = ?", [
    parcel.Direccion,
    parcel.ID,
  ]);
  await pool.query("update clientes set Colonia = ? where ClienteID = ?", [
    parcel.Colonia,
    parcel.ID,
  ]);
  await pool.query("update clientes set Referencia = ? where ClienteID = ?", [
    parcel.Referencia,
    parcel.ID,
  ]);
  await pool.query("update clientes set Telefono = ? where ClienteID = ?", [
    parcel.Telefono,
    parcel.ID,
  ]);
  await pool.query("update clientes set Estado = ? where ClienteID = ?", [
    parcel.Estado,
    parcel.ID,
  ]);

  if (parcel.Estado == "Activo" && parcel.Confirmacion == true) {
    const [TechID] = await pool.query(
      "select * from visitas where clienteID = ? and Estado = 'Pendiente' ",
      parcel.ID
    );
    if (TechID.length > 0) {
      await pool.query(
        "update visitas set Estado = 'Completado' where IDVisita = ?",
        TechID[0].IDVisita
      );
      await pool.query(
        "update clientes set Estado = 'Activo' where ClienteID = ?",
        parcel.ID
      );
      await pool.query(
        "update tecnicos set disponibilidad = 'Disponible' where tecnicoID = ?",
        TechID[0].TecnicoID
      );
    } else {
      await pool.query(
        "update clientes set Estado = 'Activo' where ClienteID = ?",
        parcel.ID
      );
    }
  }

  if (parcel.Estado == "Inactivo") {
    const [TechID] = await pool.query(
      "select * from visitas where clienteID = ? and Estado = 'Pendiente' ",
      parcel.ID
    );
    if (TechID.length > 0) {
      await pool.query(
        "update visitas set Estado = 'Completado' where IDVisita = ?",
        TechID[0].IDVisita
      );
      await pool.query(
        "update clientes set Estado = 'Inactivo' where ClienteID = ?",
        parcel.ID
      );
      await pool.query(
        "update tecnicos set disponibilidad = 'Disponible' where tecnicoID = ?",
        TechID[0].TecnicoID
      );
    } else {
      await pool.query(
        "update clientes set Estado = 'Inactivo' where ClienteID = ?",
        parcel.ID
      );
    }
  }
  //const [Tecnico] = await pool.query("");

  const [rows] = await pool.query(
    "Select * from Clientes where ClienteID = ?",
    parcel.ID
  );

  //pool.query("update clientes set Direccion = ? where ClienteID = ?", )
  res.json(rows);
};
export const getColonias = async (req, res) => {
  const [rows] = await pool.query(
    "Select * from colonias order by nombrecolonia asc"
  );

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Tecnico no encontrado",
    });
  res.json(rows);
};

export const getUsuarios = async (req, res) => {
  const { parcel } = req.body;
  const [rows] = await pool.query(
    "Select * from users where UserName = ?",
    parcel.ID
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(rows);
};

export const getTecnicoUnico = async (req, res) => {
  const { parcel } = req.body;
  const [rows] = await pool.query(
    "Select * from tecnicos where UserName = ?",
    parcel.ID
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(rows);
};

export const gettecnicosDisponiblesCombo = async (req, res) => {
  const [rows] = await pool.query(
    "Select * from tecnicos where Disponibilidad = 'Disponible'"
  );

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Tecnico no encontrado",
    });
  res.json(rows);
};

export const getTecnicosDisponibles = async (req, res) => {
  const [rows] = await pool.query(
    "Select * from tecnicos where Disponibilidad = 'Disponible'"
  );

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Tecnico no encontrado",
    });
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getClientes = async (req, res) => {
  const [rows] = await pool.query("Select * from clientes");

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getTecnicos = async (req, res) => {
  const [rows] = await pool.query("select* from tecnicos");
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getTecnicosForEdit = async (req, res) => {
  const [rows] = await pool.query(
    "select* from tecnicos where Disponibilidad = 'Disponible' or Disponibilidad = 'Ocupado'"
  );
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const tecnicosCombo = async (req, res) => {
  const [rows] = await pool.query(
    "select* from tecnicos where Disponibilidad = 'Disponible' or Disponibilidad = 'Ocupado' order by NombreTec ASC"
  );
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(rows);
};
export const orderbyVista = async (req, res) => {
  const { parcel } = req.body;
  let [rows] = "";

  if (parcel.Columna == 0) {
    [rows] = await pool.query("select * from visitas order by IDVISITA desc");
  }
  if (parcel.Columna == 1) {
    [rows] = await pool.query(
      "select * from visitas order by NombreCliente ASC"
    );
  }
  if (parcel.Columna == 2) {
    [rows] = await pool.query("select * from visitas order by clienteid ASC");
  }
  if (parcel.Columna == 3) {
    [rows] = await pool.query("select * from visitas order by Colonia ASC");
  }
  if (parcel.Columna == 4) {
    [rows] = await pool.query("select * from visitas order by Servicio ASC");
  }
  if (parcel.Columna == 6) {
    [rows] = await pool.query("select * from visitas order by NombreTec ASC");
  }
  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = rows.slice(startIndex, endIndex);

  res.json(results);
};

export const orderbyTecnico = async (req, res) => {
  const { parcel } = req.body;
  let [rows] = "";

  let values = null;

  //  let values = ` ${parcel.Columna} `
  if (parcel.Columna == 0) {
    [rows] = await pool.query("select * from tecnicos order by TecnicoID desc");
  }
  if (parcel.Columna == 1) {
    [rows] = await pool.query("select * from tecnicos order by UserName asc");
  }
  if (parcel.Columna == 2) {
    [rows] = await pool.query("select * from tecnicos order by NombreTec asc");
    values = "Colonia";
  }
  if (parcel.Columna == 3) {
    [rows] = await pool.query(
      "select * from tecnicos order by Emailaddress asc"
    );
    values = "Estado";
  }
  if (parcel.Columna == 4) {
    [rows] = await pool.query("select * from tecnicos order by Tenure asc");
    values = "Estado";
  }
  if (rows < 0) {
    return res.status(404).json({ message: "Can not order by" });
  }
  // res.json(rows)

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const crearTecnico = async (req, res) => {
  const { parcel } = req.body;
  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  let array = [
    parcel.Usuario,
    parcel.Nombre,
    "Tecnico",
    parcel.Correo,
    "Disponible",
    currentDate,
  ];

  const [rows] = await pool.query(
    "insert into tecnicos (UserName, NombreTec, UserType, Emailaddress, Disponibilidad, Tenure) values (?,?,?,?,?,?)",
    array
  );
  await pool.query(
    "insert into tecnicosC (UserName, NombreTec, SavedPassword, UserType) values (?, ?, ?, ?)",
    [parcel.Usuario, parcel.Nombre, parcel.Pass, "Tecnico"]
  );
  // const [rows] = await pool.query("insert into tecnicos (UserName, NombreTec, UserType, Emailaddress, Disponibilidad, Tenure) values (?,?,?,?,?,?)",[array])
  res.json(rows);
};

export const getFilterNameInCliente = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM clientes WHERE Nombre LIKE ?",
    values
  );
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = rows.slice(startIndex, endIndex);
  res.json(results);
};

export const getFilterIdentidadInCliente = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM clientes WHERE IDENTIDAD LIKE ?",
    values
  );

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = rows.slice(startIndex, endIndex);
  res.json(results);
};
export const getFilterEstadoInCliente = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM clientes WHERE Estado LIKE ?",
    values
  );

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = rows.slice(startIndex, endIndex);
  res.json(results);
};

export const getFilterColoniaInCliente = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM clientes WHERE Colonia LIKE ?",
    values
  );

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = rows.slice(startIndex, endIndex);
  res.json(results);
};

export const getVistaVisitas = async (req, res) => {
  const [rows] = await pool.query(
    "select IDVisita, NombreCliente, Direccion, Colonia, Servicio, CAST(FechaVisita AS DATE) as FechaVisita, NombreTec, Estado, Clienteid from Visitas"
  );

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getVistaVisitasPreviw = async (req, res) => {
  const [rows] = await pool.query(
    "select IDVisita, NombreCliente, Direccion, Colonia, Servicio, CAST(FechaVisita AS DATE) as FechaVisita, NombreTec, Estado, Clienteid from Visitas"
  );

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const VisitaSeleccionada = async (req, res) => {
  const { parcel } = req.body;
  const [rows] = await pool.query(
    "select * from visitas where IDVISITA = ?",
    parcel.ID
  );
  if (rows < 0) {
    return res.status(404).json({
      message: "Visita no encontrada",
    });
  }
  res.json(rows);
};

export const crearCliente = async (req, res) => {
  const { parcel } = req.body;
  const [rows] = await pool.query("");
};

export const orderbyCliente = async (req, res) => {
  const { parcel } = req.body;
  let [rows] = "";
  //  let values = ` ${parcel.Columna} `
  if (parcel.Columna == 1) {
    [rows] = await pool.query("select * from clientes order by Nombre asc");
  }
  if (parcel.Columna == 3) {
    [rows] = await pool.query("select * from clientes order by Colonia asc");
  }
  if (parcel.Columna == 7) {
    [rows] = await pool.query("select * from clientes order by Estado asc");
  }

  if (rows < 0) {
    return res.status(404).json({ message: "Can not order by" });
  }
  // res.json(rows)

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = rows.slice(startIndex, endIndex);
  res.json(results);
};

export const getVisitafromTecnico = async (req, res) => {
  const { parcel } = req.body;

  const [TechID] = await pool.query(
    "select * from tecnicos where Username = ?",
    parcel.Usuario
  );

  const [rows] = await pool.query(
    "select * from visitas where tecnicoid = ? and estado = 'Pendiente'",
    TechID[0].TecnicoID
  );
  if (rows.length <= 0) {
    return res.status(200).json({
      message: 0,
    });
  } else {
    res.json(rows);
  }
};

export const CompletarVisitaTecnico = async (req, res) => {
  const { parcel } = req.body;

  const [visitaINfo] = await pool.query(
    "select * from visitas where idvisita = ?",
    parcel.VisitaID
  );
  await pool.query(
    "insert into encuesta (NombreCliente, Nombretec, ServicioSolicitado, IDVisita, IDTec, Colonia, FechaVisita, Valoracion, Comentario) values(?,?,?,?,?,?,?,?,?)",
    [
      visitaINfo[0].NombreCliente,
      visitaINfo[0].NombreTec,
      parcel.Servicio,
      parcel.VisitaID,
      visitaINfo[0].TecnicoID,
      visitaINfo[0].Colonia,
      visitaINfo[0].FechaVisita,
      parcel.Valoracion,
      parcel.Comentario,
    ]
  );

  await pool.query(
    "update visitas set Estado = 'Completado' where IDVisita = ?",
    parcel.VisitaID
  );
  await pool.query(
    "update tecnicos set Disponibilidad = 'Disponible' where TecnicoID = ?",
    visitaINfo[0].TecnicoID
  );
  // res.sendStatus(200)
  const [rows] = await pool.query("select * from tecnicos");
  res.send(rows);
};

export const postClientes = async (req, res) => {
  const { parcel } = req.body;
  const estado = "Pendiente";
  const tipo = "Instalación";
  const [Cliente] = await pool.query(
    "select max(clienteid) as ID from clientes"
  );
  let ID = 1 + Cliente[0].ID;

  const [rows] = await pool.query(
    "insert into Clientes (Nombre, Direccion, Colonia, Referencia, Telefono, Identidad, Estado) values (?,?,?,?,?,?,?)",
    [
      parcel.Nombre,
      parcel.Direccion,
      parcel.Colonia,
      parcel.Referencia,
      parcel.Telefono,
      parcel.Identidad,
      estado,
    ]
  );
  pool.query(
    "update tecnicos set Disponibilidad = 'Ocupado' where TecnicoID = ?",
    [parcel.selectedIDTech]
  );
  pool.query(
    "insert into visitas (NombreCliente,Direccion,Colonia,Referencia,Telefono,FechaVisita,Servicio,TecnicoID,NombreTec,Estado,ClienteID) values (?,?,?,?,?,?,?,?,?,?,?)",
    [
      parcel.Nombre.trim(),
      parcel.Direccion.trim(),
      parcel.Colonia.trim(),
      parcel.Referencia.trim(),
      parcel.Telefono.trim(),
      parcel.fecha.trim(),
      tipo.trim(),
      parcel.selectedIDTech,
      parcel.selectedTech.trim(),
      parcel.Estado.trim(),
      ID,
    ]
  );
  res.send({ rows });
};

export const ActualizarVisita = async (req, res) => {
  const { parcel } = req.body;

  let value = null;

  let [rowsTechID] = []; // if Tech is updated
  let [TechID] = []; // if visit is ended
  //let [CxID] = [] // if visit is ended
  if (parcel.IDTecnico == null) {
    [rowsTechID] = await pool.query(
      "select TecnicoID from visitas where IDVISITA = ?",
      parcel.ID
    );
    value = rowsTechID[0].TecnicoID;
  } else {
    value = parcel.IDTecnico;
  }
  const fecha = parcel.Year + "-" + parcel.Mes + "-" + parcel.Dia;

  await pool.query("Update visitas set Direccion = ? where IDVISITA = ?", [
    parcel.Direccion,
    parcel.ID,
  ]);
  await pool.query("Update visitas set Colonia = ? where IDVISITA = ?", [
    parcel.Colonia.trim(),
    parcel.ID,
  ]);
  await pool.query("Update visitas set Servicio = ? where IDVISITA = ?", [
    parcel.Servicio.trim(),
    parcel.ID,
  ]);
  await pool.query("Update visitas set TECNICOID = ? where IDVISITA = ?", [
    value,
    parcel.ID,
  ]);
  await pool.query("Update visitas set NombreTec = ? where IDVISITA = ?", [
    parcel.NombreTecnico,
    parcel.ID,
  ]);
  await pool.query("Update visitas set FechaVisita = ? where IDVISITA = ?", [
    fecha,
    parcel.ID,
  ]);

  if (parcel.Estado == "Completado" || parcel.Estado == "Descartada") {
    [TechID] = await pool.query(
      "select TecnicoID from visitas where IDVISITA = ?",
      parcel.ID
    );

    const [CxID] = await pool.query(
      "select clienteid from visitas where idvisita = ?",
      parcel.ID
    );

    await pool.query(
      "update tecnicos set disponibilidad = 'Disponible' where TecnicoID = ?",
      TechID[0].TecnicoID
    );

    await pool.query(
      "update clientes set estado = 'Activo' where ClienteID = ?",
      CxID[0].clienteid
    );
    await pool.query("Update visitas set estado = ? where IDVISITA = ?", [
      parcel.Estado,
      parcel.ID,
    ]);
  }

  const [rows] = await pool.query(
    "select * from visitas where IDVISITA= ?",
    parcel.ID
  );
  res.json(rows);
};

export const getFilterNameInVisita = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM visitas WHERE NombreCliente LIKE ?",
    values
  );

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Visita no encontrada",
    });
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getFilterColoniaInVisita = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM visitas WHERE Colonia LIKE ?",
    values
  );

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Visita no encontrada",
    });
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getFilterServicioInVisita = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM visitas WHERE servicio LIKE ?",
    values
  );

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Visita no encontrada",
    });
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getFilterTechInVisita = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM visitas WHERE NombreTec LIKE ?",
    values
  );

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Visita no encontrada",
    });
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getFilterEstadoInVisita = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM visitas WHERE Estado LIKE ?",
    values
  );

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Visita no encontrada",
    });
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};

export const getFiltereEstadoInTech = async (req, res) => {
  const { parcel } = req.body;
  let values = `%${parcel.Nombre}%`;
  const [rows] = await pool.query(
    "SELECT * FROM tecnicos WHERE disponibilidad LIKE ?",
    values
  );

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Visita no encontrada",
    });
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < rows.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  results.results = rows.slice(startIndex, endIndex);

  if (rows.length <= 0)
    return res.status(404).json({
      message: "Empleado no encontrado",
    });
  res.json(results);
};
