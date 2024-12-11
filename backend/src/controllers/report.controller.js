import { handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { asistenciaAlumnosService,
         cantidadInscritosService,
         estadoTallerService,
         inscritosAlumnosService, 
         inscritosTallerService,
         tallerProfesorService,
         // eslint-disable-next-line sort-imports
         profesorTallerService
        } from "../services/report.service.js";

export async function inscritosTallerController(req, res) {
    try {
        const { id } = req.params;
        const [taller, errorTaller] = await inscritosTallerService(id);

        if (errorTaller) { return handleErrorClient(res, 400, errorTaller); }

        return handleSuccess(res, 200, "Alumnos inscritos en el taller", taller);

    } catch (error) {
        handleErrorServer(res, 500, Error.message);
    }
}

export async function inscritosAlumnosController(req, res) {
    try {
        const { rut } = req.params;
        // console.log(rut);
        const [alumnos, errorAlumnos] = await inscritosAlumnosService(rut);
        
        if (errorAlumnos) { return handleErrorClient(res, 400, errorAlumnos); }

        return handleSuccess(res, 200, "Talleres inscritos por el alumno", alumnos);

    } catch (error) {
        handleErrorServer(res, 500, Error.message);
    }
}

export async function cantidadInscritosController(req, res) {
    try {
        // console.log("cantidadInscritosController");
        const [ cantidad, errorCantidad ] =  await cantidadInscritosService();
        // console.log("pasa por el service");
        if (errorCantidad) { return handleErrorClient(res, 400, errorCantidad); }

        return handleSuccess(res, 200, "Cantidad de inscritos en el taller", cantidad);

    } catch (error) {
        handleErrorServer(res, 500, Error.message);
    }
}

export async function estadoTallerController(req, res) {
    try {
        const { estado } = req.params;
        
        const [Estado, errorEstado] = await estadoTallerService(estado);
        console.log("estado controller", Estado);
        console.log("error controller", errorEstado);

        if (errorEstado) { return handleErrorClient(res, 400, errorEstado); }

        return handleSuccess(res, 200, "Talleres con el estado", Estado);
    } catch (error) {
        handleErrorServer(res, 500, Error.message); 
        
    }
}

export async function tallerProfesorController(req, res) { //mostrar los talleres con sus respectivos profesor
    try {
        const [profesor, errorProfesor] = await tallerProfesorService();
        
        if (errorProfesor) { return handleErrorClient(res, 400, errorProfesor); }
      
        return handleSuccess(res, 200, "talleres con sus respectivos profesor ", profesor);

    } catch (error) {
        handleErrorServer(res, 500, Error.message);
    }
}

//mostrar los talleres de un profesor en especifico
export async function profesorTallerController(req, res) {
    try {
        const { name } = req.params;
       
        const [profesor, errorProfesor] = await profesorTallerService(name);

        if (errorProfesor) { return handleErrorClient(res, 400, errorProfesor); }

        return handleSuccess(res, 200, "Talleres del profesor", profesor);

    } catch (error) {
        handleErrorServer(res, 500, Error.message);
    }
}


export async function asistenciaAlumnosController(req, res) { //mostrar asistencia de los alumnos en un taller
    try {
        const { id } = req.params;
        const [asistencia, errorAsistencia] = await asistenciaAlumnosService(id);
        if (errorAsistencia) { return handleErrorClient(res, 400, errorAsistencia); }
      
        return handleSuccess(res, 200, "Asistencia del taller ", asistencia);

    } catch (error) {
        handleErrorServer(res, 500, Error.message);
    }
}

