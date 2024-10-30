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
       
        return [taller, null];
    } catch (error) {
        return [null, error.message];
    } 
}

export async function inscritosAlumnosService(id) { //funcion contraria por alumno en cuantos talleres esta inscrito
    try {
        const userRepository = AppDataSource.getRepository(User);

        const alumnos = await userRepository.findOne({
            where: { id: id, rol: ("estudiante") },
            relations: ["talleres"],
        });

        if(!alumnos){ return [null, "No se encontraron alumnos "]; }

        return [alumnos, null];
    } catch (error) {   
        return [null, error.message];
    }
}

export async function asistenciaAlumnosService(id){
    try {
        const userRepository = AppDataSource.getRepository(Taller);
 
        const asistencia = await userRepository.findOne({
            where: { id: id },
            relations: ["asistencia"],
        });
        
        if(!asistencia){ return [null, "No se encontraron alumnos "]; }
       
        return [asistencia, null];
    } catch (error) {   
        return [null, error.message];
    }
}