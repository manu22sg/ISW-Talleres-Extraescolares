"use strict";
import { Router } from "express"; // Asegúrate de usar ES Modules
const router = Router();

// Definir las rutas aquí
router.get("/", (req, res) => {
    res.send("Lista de talleres");
});

export default router; // Usa export default
