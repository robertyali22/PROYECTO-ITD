import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  User,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react";
import solicitudService from "../services/solicitudService";
import usuarioService from "../services/usuarioService";

export default function Administrativa() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("pendiente");
  const [procesando, setProcesando] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 10;
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await solicitudService.obtenerSolicitudes();
      // data puede ser un array o undefined si el servidor devolvió HTML; validar
      if (!data || !Array.isArray(data)) {
        toast.error("Respuesta inesperada del servidor al obtener solicitudes");
        setSolicitudes([]);
      } else {
        setSolicitudes(data);
      }
    } catch (error) {
      console.error("Error cargarSolicitudes:", error);
      toast.error(error.message || "Error al cargar las solicitudes");
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const data = await usuarioService.obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const toggleMostrarUsuarios = () => {
    setMostrarUsuarios(!mostrarUsuarios);
    if (!mostrarUsuarios) {
      cargarUsuarios(); // Cargar usuarios solo si se va a mostrar
    }
  };

  useEffect(() => {
    cargarSolicitudes();
    cargarUsuarios();
  }, []);

  const aprobarSolicitud = async (id) => {
    setProcesando((prev) => ({ ...prev, [id]: true }));
    try {
      await solicitudService.aprobarSolicitud(id);
      toast.success("Solicitud aprobada. Usuario ahora es proveedor.");
      await cargarSolicitudes();
    } catch (error) {
      console.error("aprobarSolicitud error:", error);
      toast.error(error.message || "Error al aprobar solicitud");
    } finally {
      setProcesando((prev) => ({ ...prev, [id]: false }));
    }
  };

  const rechazarSolicitud = async (id) => {
    setProcesando((prev) => ({ ...prev, [id]: true }));
    try {
      await solicitudService.rechazarSolicitud(id);
      toast.success("Solicitud rechazada");
      await cargarSolicitudes();
    } catch (error) {
      console.error("rechazarSolicitud error:", error);
      toast.error(error.message || "Error al rechazar solicitud");
    } finally {
      setProcesando((prev) => ({ ...prev, [id]: false }));
    }
  };

  // filtrar con tolerancia a distintos nombres de estado
  const solicitudesFiltradas = solicitudes.filter((sol) => {
    if (filtro === "todos") return true;
    // normalizamos el estado a minúsculas
    const estado = (sol.estado || sol.estadoSolicitud || "")
      .toString()
      .toLowerCase();
    return estado === filtro;
  });

  const EstadoBadge = ({ estado }) => {
    const e = (estado || "").toString().toLowerCase();
    const configs = {
      pendiente: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: Clock,
        label: "Pendiente",
      },
      aprobado: {
        color: "bg-green-100 text-green-800 border-green-300",
        icon: CheckCircle,
        label: "Aprobado",
      },
      rechazado: {
        color: "bg-red-100 text-red-800 border-red-300",
        icon: XCircle,
        label: "Rechazado",
      },
    };
    const config = configs[e] || configs.pendiente;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  // Calcular los usuarios a mostrar en la página actual
  const indexOfLastUser = paginaActual * usuariosPorPagina;
  const indexOfFirstUser = indexOfLastUser - usuariosPorPagina;
  const usuariosAmostrar = usuarios.slice(indexOfFirstUser, indexOfLastUser);
  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter((u) => u.rol === "administrador").length;
  const totalProveedores = usuarios.filter((u) => u.rol === "proveedor").length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel Administrativo
          </h1>
          <p className="text-gray-600">
            Gestiona las solicitudes de proveedores
          </p>
        </div>
        {/* Indicadores superiores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
          {/* Total Usuarios */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total de Usuarios
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {totalUsuarios}
            </p>
          </div>

          {/* Total Administradores */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Administradores
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalAdmins}</p>
          </div>

          {/* Total Proveedores */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Proveedores
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {totalProveedores}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMostrarUsuarios}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  mostrarUsuarios
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Lista Total de Usuarios
              </button>
              <button
                onClick={() => setFiltro("todos")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filtro === "todos"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todas ({solicitudes.length})
              </button>
              <button
                onClick={() => setFiltro("pendiente")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filtro === "pendiente"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pendientes (
                {
                  solicitudes.filter(
                    (s) =>
                      (s.estado || "").toString().toLowerCase() === "pendiente"
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setFiltro("aprobado")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filtro === "aprobado"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Aprobadas (
                {
                  solicitudes.filter(
                    (s) =>
                      (s.estado || "").toString().toLowerCase() === "aprobado"
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setFiltro("rechazado")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filtro === "rechazado"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Rechazadas (
                {
                  solicitudes.filter(
                    (s) =>
                      (s.estado || "").toString().toLowerCase() === "rechazado"
                  ).length
                }
                )
              </button>
            </div>

            <button
              onClick={cargarSolicitudes}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <RefreshCw className="w-4 h-4" /> Actualizar
            </button>
          </div>
        </div>

        {/* Tabla de usuarios */}
        {mostrarUsuarios && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Usuarios Registrados</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apellido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosAmostrar.map((usuario) => {
                  // Determinar el color del texto según el rol
                  let rolColor;
                  switch (usuario.rol) {
                    case "usuario":
                      rolColor = "text-blue-600"; // Azul para usuario
                      break;
                    case "proveedor":
                      rolColor = "text-yellow-600"; // Amarillo para proveedor
                      break;
                    case "administrador":
                      rolColor = "text-green-600"; // Verde para administrador
                      break;
                    default:
                      rolColor = "text-gray-900"; // Color por defecto
                  }

                  return (
                    <tr key={usuario.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.apellido}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usuario.telefono}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${rolColor}`}
                      >
                        {usuario.rol}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
                }
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {solicitudesFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay solicitudes
            </h3>
            <p className="text-gray-500">
              {filtro === "todos"
                ? "No se encontraron solicitudes"
                : `No hay solicitudes con estado "${filtro}"`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudesFiltradas.map((s) => {
              // Fallbacks por si los nombres de campo vienen distintos
              const id = s.id;
              const usuarioId = s.usuarioId;
              const usuarioNombre = s.nombreUsuario;
              const usuarioEmail = s.emailUsuario;
              const fecha = new Date(s.fechaRegistro).toLocaleDateString(
                "es-PE"
              );

              const estado = (s.estado || "").toLowerCase();
              const ruc = s.ruc;
              const nombreEmpresa = s.nombreEmpresa;
              const razonSocial = s.razonSocial;
              const descripcion = s.descripcion;
              const direccion = s.direccion;
              const telefono = s.telefonoEmpresa;
              const email = s.emailEmpresa;

              const calificacion = s.calificacionPromedio;
              return (
                <div
                  key={id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {nombreEmpresa}
                          </h3>
                          <EstadoBadge estado={estado} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Id usuario:</span>
                          <span>{id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Usuario:</span>
                          <span>{usuarioNombre}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">RUC:</span>
                          <span>{ruc}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Email:</span>
                          <span>{email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Teléfono:</span>
                          <span>{telefono}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Dirección:</span>
                          <span>{direccion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Fecha:</span>
                          <span>{fecha}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Descripción:
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {descripcion}
                        </p>
                      </div>
                    </div>

                    {estado === "pendiente" && (
                      <div className="flex lg:flex-col gap-3 lg:min-w-[180px]">
                        <button
                          onClick={() => aprobarSolicitud(id)}
                          disabled={procesando[id]}
                          className="flex-1 lg:flex-none px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                        >
                          {procesando[id] ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Aprobar
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => rechazarSolicitud(id)}
                          disabled={procesando[id]}
                          className="flex-1 lg:flex-none px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                        >
                          {procesando[id] ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Rechazar
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
