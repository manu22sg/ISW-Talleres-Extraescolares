import { handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { asistenciaAlumnosService,
         inscritosAlumnosService, 
         inscritosTallerService 
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
        const { id } = req.params;
        //console.log(id);
        const [alumnos, errorAlumnos] = await inscritosAlumnosService(id);
        
        if (errorAlumnos) { return handleErrorClient(res, 400, errorAlumnos); }

        return handleSuccess(res, 200, "Talleres inscritos por el alumno", alumnos);

    } catch (error) {
        handleErrorServer(res, 500, Error.message);
    }
}

export async function asistenciaAlumnosController(req, res) { //mostrar asistencia de los alumnos en un taller
    try {
        const { id } = req.params;
        
        const [asistencia, errorAsistencia] = await asistenciaAlumnosService(id);
        
        if (errorAsistencia) { return handleErrorClient(res, 400, errorAsistencia); }
        console.log("13")
        return handleSuccess(res, 200, "Asistencia del taller ", asistencia);

    } catch (error) {
        handleErrorServer(res, 500, Error.message);
    }
}

