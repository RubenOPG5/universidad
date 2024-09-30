"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminar = exports.actualizarInscripcion = exports.modificar = exports.inscribir = exports.mostrarFormularioInscripcion = exports.consultarPorFiltro = exports.consultarInscripciones = exports.validar = void 0;
const express_validator_1 = require("express-validator");
const cursoEstudianteModel_1 = require("../models/cursoEstudianteModel");
const conexion_1 = require("../db/conexion");
const estudianteModel_1 = require("../models/estudianteModel");
const cursoModel_1 = require("../models/cursoModel");
var cursoEstudiante;
const validar = () => [
    (0, express_validator_1.check)('estudiante_id')
        .notEmpty().withMessage('El id es obligatorio')
        .isNumeric().withMessage('El ID debe ser un número'),
    (0, express_validator_1.check)('curso_id')
        .notEmpty().withMessage('El id es obligatorio')
        .isNumeric().withMessage('El ID debe ser un número'),
    (0, express_validator_1.check)('calificacion').isFloat({ min: 0, max: 10 }).withMessage('La calificación debe ser un número entre 0 y 10'),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render('creaInscripciones', {
                pagina: 'Crear Inscripcion',
                errores: errores.array()
            });
        }
        next();
    }
];
exports.validar = validar;
const consultarInscripciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estudiante_id, curso_id } = req.query;
    try {
        const cursoEstudianteRepository = conexion_1.AppDataSource.getRepository(cursoEstudianteModel_1.CursoEstudiante);
        const estudiantesRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const cursosRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const whereConditions = {};
        if (estudiante_id) {
            const estudianteIdNumber = Number(estudiante_id);
            if (!isNaN(estudianteIdNumber)) {
                whereConditions.estudiante = { id: estudianteIdNumber };
            }
        }
        if (curso_id) {
            const cursoIdNumber = Number(curso_id);
            if (!isNaN(cursoIdNumber)) {
                whereConditions.curso = { id: cursoIdNumber };
            }
        }
        // Filtra según los parámetros, si se proporcionan
        const cursoEstudiante = yield cursoEstudianteRepository.find({
            where: whereConditions,
            relations: ['estudiante', 'curso']
        });
        const estudiantes = yield estudiantesRepository.find();
        const cursos = yield cursosRepository.find();
        res.render('listarInscripciones', {
            pagina: 'Lista de Inscripciones',
            cursoEstudiante,
            estudiantes,
            cursos
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarInscripciones = consultarInscripciones;
const consultarPorFiltro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estudiante_id, curso_id } = req.params;
    // Preparar condiciones de filtrado
    const whereConditions = {};
    if (estudiante_id) {
        const estudianteIdNumber = Number(estudiante_id);
        if (!isNaN(estudianteIdNumber)) {
            whereConditions.estudiante = { id: estudianteIdNumber };
        }
    }
    if (curso_id) {
        const cursoIdNumber = Number(curso_id);
        if (!isNaN(cursoIdNumber)) {
            whereConditions.curso = { id: cursoIdNumber };
        }
    }
    try {
        const cursoEstudianteRepository = conexion_1.AppDataSource.getRepository(cursoEstudianteModel_1.CursoEstudiante);
        const inscripciones = yield cursoEstudianteRepository.find({
            where: whereConditions,
            relations: ["curso", "estudiante"] // relaciones
        });
        if (inscripciones.length === 0) {
            return res.status(404).send('No se encontraron inscripciones con los filtros proporcionados');
        }
        return res.render('listarInscripciones', { inscripciones }); // Renderiza la vista con los resultados filtrados
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Error en la consulta');
    }
});
exports.consultarPorFiltro = consultarPorFiltro;
//FUNCIONA PERO TRAE SIEMPRE TODOS LOS DATOS    
/*export const consultarInscripciones = async (req: Request, res: Response) => {
    try {
        const cursoEstudianteRepository = AppDataSource.getRepository(CursoEstudiante);
        const estudiantesRepository = AppDataSource.getRepository(Estudiante);
        const cursosRepository = AppDataSource.getRepository(Curso);
        
        const cursoEstudiante = await cursoEstudianteRepository.find({ relations: ['estudiante', 'curso'] });
        const estudiantes = await estudiantesRepository.find(); // Obtener todos los estudiantes
        const cursos = await cursosRepository.find(); // Obtener todos los cursos
        
        res.render('listarInscripciones', {
            pagina: 'Lista de Inscripciones',
            cursoEstudiante,
            estudiantes,
            cursos
        });
        
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
};
/*
export const consultarxAlumno = async (req: Request, res: Response) => {
    console.log(cursoEstudiante);
    const { estudiante_id, curso_id } = req.params;

    const estudianteIdNumber = Number(estudiante_id);
    const cursoIdNumber = Number(curso_id);
    
    if (isNaN(estudianteIdNumber) || isNaN(cursoIdNumber)) {
        return null; // Indica un error en los ID
    }

    try {
        const cursoEstudianteRepository = AppDataSource.getRepository(CursoEstudiante);
        const cursoEstudiante = await cursoEstudianteRepository.findOne({
            where: { estudiante: { id: estudianteIdNumber }, curso: { id: cursoIdNumber } },
            relations: ["curso"]
        });
        console.log(cursoEstudiante);
        return cursoEstudiante; // Solo retorna el objeto
    } catch (err: unknown) {
        // Maneja el error, pero no respondas con JSON aquí
        console.error(err);
        return null; // Indica un error en la consulta
    }
};

export const consultarxCurso = async (req: Request, res: Response) => {
    const { curso_id } = req.params;

    const idNumber = Number(curso_id);
    if (isNaN(idNumber)) {
        return res.status(400).json({ mensaje: 'ID inválido, debe ser un número' });
    }
    
    try {
        const cursoEstudianteRepository = AppDataSource.getRepository(CursoEstudiante);
        const cursoEstudiante = await cursoEstudianteRepository.find({ where: { curso: { id: idNumber } }, relations: ["estudiante"] });

        if (cursoEstudiante.length > 0) {
            return res.json(cursoEstudiante);
        } else {
            return res.status(404).json({ mensaje: 'No se encontraron inscripciones para el curso' });
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(500).json({ mensaje: err.message });
        } else {
            return res.status(500).json({ mensaje: 'Error desconocido' });
        }
    }
};*/
const mostrarFormularioInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const estudiantes = yield estudianteRepository.find();
        ;
        const cursos = yield cursoRepository.find();
        ;
        res.render('creaInscripciones', {
            pagina: 'Crear Inscripción',
            estudiantes,
            cursos
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el formulario de inscripción');
    }
});
exports.mostrarFormularioInscripcion = mostrarFormularioInscripcion;
const inscribir = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        console.log(errores);
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const estudiantes = yield estudianteRepository.find();
        const cursos = yield cursoRepository.find();
        return res.render('creaInscripciones', {
            pagina: 'Crear Inscripción',
            estudiantes,
            cursos,
            cursoEstudiante
        });
    }
    const { estudiante_id, curso_id, calificacion } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursoRepository = transactionalEntityManager.getRepository(cursoModel_1.Curso);
            const estudianteRepository = transactionalEntityManager.getRepository(estudianteModel_1.Estudiante);
            const cursoEstudianteRepository = transactionalEntityManager.getRepository(cursoEstudianteModel_1.CursoEstudiante);
            const existeEstudiante = yield estudianteRepository.findOne({ where: { id: Number(estudiante_id) } });
            if (!existeEstudiante) {
                return res.status(404).json({ mensaje: 'El estudiante no existe.' });
            }
            const existeCurso = yield cursoRepository.findOne({ where: { id: Number(curso_id) } });
            if (!existeCurso) {
                return res.status(404).json({ mensaje: 'El curso no existe.' });
            }
            const inscripto = yield cursoEstudianteRepository.findOne({
                where: { estudiante: { id: estudiante_id }, curso: { id: curso_id } }
            });
            if (inscripto) {
                return res.status(400).json({ mensaje: 'El estudiante ya está inscripto en este curso.' });
            }
            // Verificar si se proporcionó la calificación
            const nuevaInscripcion = cursoEstudianteRepository.create({
                estudiante_id: Number(estudiante_id),
                curso_id: Number(curso_id),
                nota: calificacion || "No especificado" // Si no se proporciona, usa "No especificado"
            });
            yield cursoEstudianteRepository.save(nuevaInscripcion);
        }));
        res.redirect('/CursosEstudiantes/listarInscripciones');
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.inscribir = inscribir;
/*FUNCIONA
  export const inscribir = async (req: Request, res: Response) => {
        const errores = validationResult(req);
        
        // Verifica si hay errores de validación
        if (!errores.isEmpty()) {
            console.log(errores);
            const estudianteRepository = AppDataSource.getRepository(Estudiante);
            const cursoRepository = AppDataSource.getRepository(Curso);
            
            const estudiantes = await estudianteRepository.find();
            const cursos = await cursoRepository.find();
            console.log(cursos);
            console.log(estudiantes);
            return res.render('creaInscripciones', {
                pagina: 'Crear Inscripción',
                estudiantes,
                cursos
                
            });
        }
        
        const { estudiante_id, curso_id, calificacion } = req.body; // Desestructura
        console.log(req.body);
        
        try {
            await AppDataSource.transaction(async (transactionalEntityManager) => {
                const cursoRepository = transactionalEntityManager.getRepository(Curso);
                const estudianteRepository = transactionalEntityManager.getRepository(Estudiante);
                const cursoEstudianteRepository = transactionalEntityManager.getRepository(CursoEstudiante);
        
                // Verifica si el estudiante existe
                const existeEstudiante = await estudianteRepository.findOne({ where: { id: Number(estudiante_id) } });
                console.log(existeEstudiante);
                if (!existeEstudiante) {
                    return res.status(404).json({ mensaje: 'El estudiante no existe.' });
                }
        
                // Verifica si el curso existe
                const existeCurso = await cursoRepository.findOne({ where: { id: Number(curso_id) } });
                console.log(existeCurso);
                if (!existeCurso) {
                    return res.status(404).json({ mensaje: 'El curso no existe.' });
                }
        
                // Verifica si el estudiante ya está inscrito en el curso
                const inscripto = await cursoEstudianteRepository.findOne({
                    where: { estudiante: { id: estudiante_id }, curso: { id: curso_id } }
                });
                console.log(inscripto);
                if (inscripto) {
                    return res.status(400).json({ mensaje: 'El estudiante ya está inscripto en este curso.' });
                }
        
                // Crea la nueva inscripción
                /*const nuevaInscripcion = cursoEstudianteRepository.create({
                    curso: existeCurso,
                    estudiante: existeEstudiante,
                    nota: calificacion // Asegúrate de que esto sea el campo correcto
                });*/
/*       const nuevaInscripcion = cursoEstudianteRepository.create({
            
            estudiante_id: Number(estudiante_id), // Usar el id directamente
            curso_id:  Number(curso_id), // Usar el id directamente
            nota: calificacion
        });
        
        await cursoEstudianteRepository.save(nuevaInscripcion);
        console.log(nuevaInscripcion);
    });

    // Redirige a la lista de inscripciones
    res.redirect('/CursosEstudiantes/listarInscripciones');
  
} catch (err) {
    console.error(err); // Registro del error
    if (err instanceof Error) {
        res.status(500).send(err.message);
    }
}
};*/
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { estudiante_id, curso_id } = req.params;
        const cursoEstudianteRepository = conexion_1.AppDataSource.getRepository(cursoEstudianteModel_1.CursoEstudiante);
        const cursoEstudiante = yield cursoEstudianteRepository.findOne({
            where: {
                estudiante_id: Number(estudiante_id),
                curso_id: Number(curso_id)
            },
            relations: ['estudiante', 'curso']
        });
        if (!cursoEstudiante) {
            return res.status(404).send('Inscripción no encontrada');
        }
        // Obtener todos los estudiantes y cursos para los desplegables
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const estudiantes = yield estudianteRepository.find();
        const cursos = yield cursoRepository.find();
        // Asegúrate de que los datos se están pasando correctamente a la vista
        res.render('modificarInscripcion', {
            pagina: 'Modificar Inscripción',
            cursoEstudiante,
            estudiantes,
            cursos
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el formulario de modificación');
    }
});
exports.modificar = modificar;
const actualizarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { estudiante_id, curso_id } = req.params;
        const { nota } = req.body;
        const cursoEstudianteRepository = conexion_1.AppDataSource.getRepository(cursoEstudianteModel_1.CursoEstudiante);
        const cursoEstudiante = yield cursoEstudianteRepository.findOne({
            where: {
                estudiante_id: Number(estudiante_id),
                curso_id: Number(curso_id)
            }
        });
        if (!cursoEstudiante) {
            return res.status(404).send('Inscripción no encontrada');
        }
        cursoEstudiante.nota = nota;
        yield cursoEstudianteRepository.save(cursoEstudiante);
        res.redirect('/CursosEstudiantes/listarInscripciones');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la inscripción');
    }
});
exports.actualizarInscripcion = actualizarInscripcion;
const eliminar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estudiante_id, curso_id } = req.params;
    if (!estudiante_id || !curso_id) {
        return res.status(400).json({ mensaje: 'Faltan parámetros' });
    }
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursoEstudianteRepository = transactionalEntityManager.getRepository(cursoEstudianteModel_1.CursoEstudiante);
            // Verificar si la inscripción existe
            const inscripcion = yield cursoEstudianteRepository.findOne({
                where: {
                    estudiante_id: Number(estudiante_id),
                    curso_id: Number(curso_id),
                },
            });
            if (!inscripcion) {
                throw new Error('La inscripción no existe');
            }
            // Eliminar la inscripción
            yield cursoEstudianteRepository.remove(inscripcion);
            return res.json({ mensaje: 'Inscripción eliminada' });
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ mensaje: err.message });
        }
        else {
            return res.status(400).json({ mensaje: 'Error inesperado' });
        }
    }
});
exports.eliminar = eliminar;
