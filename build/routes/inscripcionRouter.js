"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InscripcionController_1 = require("../controllers/InscripcionController");
const router = express_1.default.Router();
// Listar inscripciones
router.get('/listarInscripciones', InscripcionController_1.consultarInscripciones);
/*router.get('/listarInscripciones/curso_id', consultarxCurso);
router.get('/listarInscripciones/estudiante_id', consultarxAlumno);*/
router.get('/CursosEstudiantes/listarInscripciones', InscripcionController_1.consultarPorFiltro);
// Insertar inscripciones
router.get('/creaInscripciones', InscripcionController_1.mostrarFormularioInscripcion); // Usa el controlador para renderizar el formulario*/, mostrarFormularioInscripcion
router.post('/creaInscripciones', (0, InscripcionController_1.validar)(), InscripcionController_1.inscribir); // Validar antes de inscribir
// Modificar inscripciones
router.get('/modificarInscripcion/:estudiante_id/:curso_id', InscripcionController_1.modificar);
router.post('/actualizarInscripcion/:estudiante_id/:curso_id', InscripcionController_1.actualizarInscripcion);
// Eliminar inscripciones
router.delete('/:estudiante_id/:curso_id', InscripcionController_1.eliminar);
exports.default = router;
