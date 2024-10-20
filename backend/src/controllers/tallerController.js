// controllers/tallerController.js
const pool = require("../config/db");

exports.inscribirEstudiante = async (req, res) => {
  const { estudiante_id, taller_id } = req.body;

  try {
    const estudianteEnTaller = await pool.query(
      "SELECT * FROM inscripciones WHERE estudiante_id = $1 AND taller_id = $2",
      [estudiante_id, taller_id]
    );

    const enListaEspera = await pool.query(
      "SELECT * FROM lista_espera WHERE estudiante_id = $1 AND taller_id = $2",
      [estudiante_id, taller_id]
    );

    if (estudianteEnTaller.rowCount > 0 || enListaEspera.rowCount > 0) {
      return res.status(400).json({ message: "Estudiante ya inscrito o en lista de espera." });
    }

    const taller = await pool.query("SELECT * FROM talleres WHERE id = $1", [taller_id]);

    if (taller.rows[0].cupos_disponibles > 0) {
      await pool.query(
        "INSERT INTO inscripciones (estudiante_id, taller_id, fecha_inscripcion) VALUES ($1, $2, NOW())",
        [estudiante_id, taller_id]
      );

      await pool.query("UPDATE talleres SET cupos_disponibles = cupos_disponibles - 1 WHERE id = $1", [taller_id]);

      res.json({ message: "Estudiante inscrito." });
    } else {
      await pool.query(
        "INSERT INTO lista_espera (estudiante_id, taller_id, fecha_solicitud) VALUES ($1, $2, NOW())",
        [estudiante_id, taller_id]
      );

      res.json({ message: "Estudiante añadido a la lista de espera." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};
