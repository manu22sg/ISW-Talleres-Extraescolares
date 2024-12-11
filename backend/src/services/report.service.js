"use strict";
import Taller from "../entity/taller.entity.js";
import User from "../entity/user.entity.js";
import { Not } from "typeorm";
import { AppDataSource } from "../config/configDb.js";


export async function inscritosTallerService(id) {// Obtener los alumnos inscritos en un taller por id
    try {
        const tallerRepository = AppDataSource.getRepository(Taller);

        const taller = await tallerRepository.findOne({ //buscacmos el taller por id con la relacion de usuarios
            where: { id: id },
            relations: ["usuarios"],
        });

        if (!taller) {
            return [null, "No se encontró el taller"];
        }

        //crearemos un objeto con los datos que necesitamos para no mostrar todos los datos del taller e alumnos
        const data_taller = {
            idTaller: taller.id,
            nombre: taller.nombre,
            descripcion: taller.descripcion,
            // fechaInicio: taller.fecha_inicio,
            // fechaTermino: taller.fecha_fin,
            alumnos: [
                taller.usuarios.map((usuario) => {
                    return {
                        //idAlumno: usuario.id,
                        nombre: usuario.nombreCompleto,
                        rut: usuario.rut,
                        email: usuario.email,
                    };
                }),
            ],
        }
       
        return [data_taller, null];
    } catch (error) {
        return [null, error.message];
    } 
}

export async function inscritosAlumnosService(rut) { //funcion contraria por alumno en cuantos talleres esta inscrito
    try {
        const userRepository = AppDataSource.getRepository(User);

        const alumnos = await userRepository.findOne({
            where: { rut: rut, rol: ("estudiante") },
            relations: ["talleres"],
        });

        if(!alumnos){ return [null, "No se encontraron alumnos "]; }

        //crearemos un objeto con los datos que necesitamos para no mostrar todos los datos del alumno
        const data_alumno = {
            nombre: alumnos.nombreCompleto,
            rut: alumnos.rut,
            email: alumnos.email,
            talleres: [
                alumnos.talleres.map((taller) => {
                    return {
                        id: taller.id,
                        nombre: taller.nombre,
                        descripcion: taller.descripcion,
                        fechaInicio: taller.fechaInicio,
                        fechaTermino: taller.fechaTermino,
                    };
                }),
            ]
        }

        return [data_alumno, null];
    } catch (error) {   
        return [null, error.message];
    }
}

export async function cantidadInscritosService() { //funcion para contar la cantidad de inscritos en un taller
    try {
        const tallerRepository = AppDataSource.getRepository(Taller);
        
        const talleres = await tallerRepository.find();
        if(!talleres){ return [null, "No se encontraron talleres"]; }
        //definimos un array para guardar los datos nombreTaller, descripcion y cantidad de inscritos 
        const data_talleres = [];
        //lo haremos atravez de un for para ir en taller por taller
        for (let i = 1; i < talleres.length; i++) {   
            const taller = await tallerRepository.findOne({
                where: { id: i },
            })
            const data_taller = {
                id: taller.id,
                nombre: taller.nombre,
                descripcion: taller.descripcion,
                cantidad: taller.inscritos
            };
            data_talleres.push(data_taller); 
        }

        return [data_talleres, null];
       
    } catch (error) {
        return [null, error.message];
    }
}

//funcion para obtener los talleres con un estado especifico
export async function estadoTallerService(estadoo){
    try {
        const userRepository = AppDataSource.getRepository(Taller);
        const taller_data = [];
        const talleres = await userRepository.find();
        
        for (let i = 1; i <= talleres.length; i++) {   
            const taller = await userRepository.findOne({
                where: { id: i, estado: estadoo },
            })   
            if(taller){
                const data_taller = {
                    id: taller.id,
                    nombre: taller.nombre,
                    descripcion: taller.descripcion,
                    estado: taller.estado
                };
                taller_data.push(data_taller);              
            } 
        }
        console.log("taller_data:",taller_data);
        if(!taller_data){ return [null, "No se encontraron talleres con el estado: " + estadoo]; }
        return [taller_data, null];
    } catch (error) {   
        return [null, error.message];
    }
}

// funcion para obtener los talleres con su respectivo profesor
export async function tallerProfesorService(){
    try {
        
        const userRepository = AppDataSource.getRepository(Taller);

        const talleres = await userRepository.find();
        const profesor = [];
        for (let i = 1; i <= talleres.length; i++) {   
            const taller = await userRepository.findOne({
                where: { id: i },
                relations: ["profesor"],
            }) 
            // console.log(taller);  
            if(taller){
                const data_taller = {
                    id: taller.id,
                    nombre: taller.nombre,
                    descripcion: taller.descripcion,
                    profesor: taller.profesor.nombreCompleto,
                    idProfesor: taller.profesor.id,
                    rutProfesor: taller.profesor.rut,
                    emailProfesor: taller.profesor.email,
                };
                profesor.push(data_taller);              
            } 
        }  
        if(!talleres){ return [null, "No se encontraron talleres "]; }
       
        return [profesor, null];
    } catch (error) {   
        return [null, error.message];
    }
}

//funcion para obtener los talleres de un profesor en especifico

export async function profesorTallerService(nombre){
    try {
        
        const tallerRepository = AppDataSource.getRepository(Taller);
        const talleres = await tallerRepository.find()
        if(!talleres){ return [null, "No se encontraron talleres "]; }

        const profesor = [];
        for (let i = 1; i <= talleres.length; i++) {   
            const taller = await tallerRepository.findOne({
                where: { id: i },
                relations: ["profesor"],
            }) 
        
            if(taller.profesor.nombreCompleto == nombre){
                const data_taller = {
                    rut: taller.profesor.rut,
                    profesor: taller.profesor.nombreCompleto,
                    email: taller.profesor.email,
                    idTaller: taller.id,
                    nombre: taller.nombre,
                    descripcion: taller.descripcion,
                    
                    
                };
                profesor.push(data_taller);              
            } 
        }

        return [profesor, null];
    } catch (error) {   
        return [null, error.message];
    }
    
}
export async function asistenciaAlumnosService(id){
    try {
        const asistencias = "asistencias";
        const asistenciaRepository = AppDataSource.getRepository(asistencias);
        
        const asistencia = await asistenciaRepository.find({
            where: { tallerId: id },
            relations: ["usuario", "taller"],
        });
        // console.log("asistencia:",asistencia);
        if(!asistencia){ return [null, "No se encontraron alumnos "]; }

        const data_asistencia = [
            asistencia.map((asistencia) => {
                return {
                    idTaller: asistencia.tallerId,
                    nombreTaller: asistencia.taller.nombre,
                    fecha: asistencia.fecha,
                    nombreAlumno: asistencia.usuario.nombreCompleto,
                    rutAlumno: asistencia.usuario.rut,
                    asistio: asistencia.estado,
                    comentario: asistencia.comentarios,
                };
            }),
        ]
       
        return [data_asistencia, null];
    } catch (error) {   
        return [null, error.message];
    }
}