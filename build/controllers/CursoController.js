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
exports.eliminar = exports.modificar = exports.formularioModificar = exports.insertar = exports.mostrarFormularioCrearCurso = exports.consultarPorFiltro = exports.consultarTodos = exports.validar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const cursoModel_1 = require("../models/cursoModel");
const profesorModel_1 = require("../models/profesorModel");
const cursoEstudianteModel_1 = require("../models/cursoEstudianteModel");
var cursos;
const validar = () => [
    (0, express_validator_1.check)('nombre').notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('El Nombre debe tener al menos 3 caracteres'),
    (0, express_validator_1.check)('descripcion').notEmpty().withMessage('La descripción es obligatoria')
        .isLength({ min: 3 }).withMessage('La Descripción debe tener al menos 3 caracteres'),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render('creaCursos', {
                pagina: 'Crear Curso',
                errores: errores.array()
            });
        }
        next();
    }
];
exports.validar = validar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profesor_id } = req.query;
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        // Condiciones de búsqueda
        const whereConditions = {};
        // Filtrar por ID de profesor si se proporciona
        if (profesor_id) {
            const profesorIdNumber = Number(profesor_id);
            if (!isNaN(profesorIdNumber)) {
                whereConditions.profesor = { id: profesorIdNumber };
            }
        }
        // Obtener cursos que coinciden con las condiciones
        const cursos = yield cursoRepository.find({
            where: whereConditions,
            relations: ['profesor'], // Añadimos la relación con profesor
        });
        // Obtener todos los profesores para el formulario
        const profesores = yield profesorRepository.find();
        // Renderizar la vista
        res.render('listarCursos', {
            pagina: 'Lista de Cursos',
            cursos,
            profesores
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarTodos = consultarTodos;
const consultarPorFiltro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profesor_id } = req.query; // Solo capturamos profesor_id
    // Preparar condiciones de filtrado
    const whereConditions = {};
    // Filtrar por ID de profesor si se proporciona
    if (profesor_id) {
        const profesorIdNumber = Number(profesor_id);
        if (!isNaN(profesorIdNumber)) {
            whereConditions.profesor = { id: profesorIdNumber };
        }
    }
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const cursos = yield cursoRepository.find({
            where: whereConditions,
            relations: ['profesor'], // Aseguramos que traemos la relación con profesor
        });
        if (cursos.length === 0) {
            return res.status(404).send('No se encontraron cursos con el profesor proporcionado');
        }
        return res.render('listarCursos', { cursos });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Error en la consulta');
    }
});
exports.consultarPorFiltro = consultarPorFiltro;
/* FUNCIONA
export const consultarTodos = async (req: Request, res: Response) => {
        try {
            const cursoRepository = AppDataSource.getRepository(Curso);
            cursos = await cursoRepository.find({
                relations: ['profesor'], // Añadimos la relación con profesor
            });
            res.render('listarCursos', {
                pagina: 'Lista de Cursos',
                cursos
            });
            console.log(cursos);
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).send(err.message);
            }
        }
    }

export const consultarUno = async (req: Request, res: Response): Promise<Curso | null> => {
        const {id}=req.params;
        const idNumber = Number(id);
        if (isNaN(idNumber)) {
            throw new Error('ID inválido, debe ser un número');
        }
    
        try {
            const cursoRepository = AppDataSource.getRepository(Curso);
            const curso = await cursoRepository.findOne({
                where: { id: idNumber },
            });
            if (curso) {
                return curso;
            } else {
                return null;
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
        } else {
            throw new Error('Error desconocido');
            }
        }
    };
*/
const mostrarFormularioCrearCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtiene la lista de profesores
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const profesores = yield profesorRepository.find(); // Asegúrate de que hay profesores en la base de datos
        // Renderiza la vista y pasa los profesores
        res.render('creaCursos', {
            pagina: 'Crear Curso',
            profesores // Pasa los profesores a la vista
        });
    }
    catch (error) {
        console.error('Error al obtener los profesores:', error);
        res.status(500).send('Error al obtener los profesores');
    }
});
exports.mostrarFormularioCrearCurso = mostrarFormularioCrearCurso;
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
    const profesores = yield profesorRepository.find();
    // Manejo de errores de validación
    if (!errores.isEmpty()) {
        return res.render('creaCursos', {
            pagina: 'Crear Curso',
            profesores, // Pasamos la lista de profesores a la vista
            errores: errores.array(), // Enviamos los errores a la vista
        });
    }
    const { nombre, descripcion, profesor_id } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const profesorRepository = transactionalEntityManager.getRepository(profesorModel_1.Profesor);
            const cursoRepository = transactionalEntityManager.getRepository(cursoModel_1.Curso);
            const existeProfesor = yield profesorRepository.findOne({ where: { id: Number(profesor_id) } });
            if (!existeProfesor) {
                throw new Error('El profesor no existe.');
            }
            const existeCurso = yield cursoRepository.findOne({
                where: [
                    { nombre },
                    { descripcion }
                ]
            });
            if (existeCurso) {
                throw new Error('El curso ya existe.');
            }
            const nuevoCurso = cursoRepository.create({
                nombre, descripcion, profesor: existeProfesor
            });
            yield cursoRepository.save(nuevoCurso);
        }));
        res.redirect('/cursos/listarCursos');
    }
    catch (err) {
        console.error(err); // Registro del error
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.insertar = insertar;
const formularioModificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Obtener el curso por su ID
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const curso = yield cursoRepository.findOne({ where: { id: parseInt(id) }, relations: ['profesor'] });
        if (!curso) {
            return res.status(404).json({ mensaje: 'El curso no existe' });
        }
        // Obtener todos los profesores
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const profesores = yield profesorRepository.find();
        // Renderizar la vista de modificación y pasar el curso y los profesores
        res.render('modificaCurso', {
            pagina: 'Modificar Curso',
            curso,
            profesores // Pasa los profesores a la vista
        });
    }
    catch (error) {
        console.error('Error al obtener el curso o los profesores:', error);
        res.status(500).send('Error al obtener el curso o los profesores');
    }
});
exports.formularioModificar = formularioModificar;
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, descripcion, profesor_id } = req.body;
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        // Obtener el curso por ID
        const curso = yield cursoRepository.findOne({ where: { id: parseInt(id) } });
        if (!curso) {
            return res.status(404).json({ mensaje: 'El curso no existe' });
        }
        // Obtener el profesor por ID
        const profesor = yield profesorRepository.findOne({ where: { id: profesor_id } });
        if (!profesor) {
            return res.status(404).json({ mensaje: 'El profesor no existe' });
        }
        // Merge los datos actualizados en el curso existente
        cursoRepository.merge(curso, { nombre, descripcion, profesor });
        // Guardar los cambios en la base de datos
        yield cursoRepository.save(curso);
        // Redirigir a la vista de listar cursos después de la modificación
        return res.redirect('/cursos/listarCursos');
    }
    catch (error) {
        console.error('Error al modificar el curso:', error);
        return res.status(500).send('Error del servidor');
    }
});
exports.modificar = modificar;
/*
export const modificar = async (req: Request, res: Response) => {

       const { id } = req.params;
       const { nombre, descripcion, profesor_id} = req.body;
   
       try {
           
           
           const cursoRepository = AppDataSource.getRepository(Curso);
           const curso = await cursoRepository.findOne({ where: { id: parseInt(id) } });
           // Verificar si el curso y el profesor  existe
           if (!curso) {
               return res.status(404).json({ mensaje: 'El curso no existe' });
           }

           const profesorRepository = AppDataSource.getRepository(Profesor);
           const profesor = await profesorRepository.findOne({ where: { id: profesor_id } });
           if (!profesor) {
           return res.status(400).json({ mensaje: 'El profesor no existe' });
            }
           // Actualizar el curso
           cursoRepository.merge(curso, { nombre, descripcion, profesor });
           await cursoRepository.save(curso);

           return res.redirect('/cursos/listarCursos');
       } catch (error) {
           console.error('Error al modificar el curso:', error);
           return res.status(500).send('Error del servidor');
           }
       };
        */
const eliminar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params); // Verifica qué parámetros llegan al backend
    const { id } = req.params;
    console.log(`ID Curso: ${id}`);
    if (!id) {
        return res.status(400).json({ mensaje: 'Faltan parámetros' });
    }
    try {
        console.log(`ID recibido para eliminar: ${id} `);
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursoEstudianteRepository = transactionalEntityManager.getRepository(cursoEstudianteModel_1.CursoEstudiante); //estudiantes cursando
            const cursoRepository = transactionalEntityManager.getRepository(cursoModel_1.Curso);
            // Verificar si hay alumnos asociados al curso   
            const estudiantesAsignados = yield cursoEstudianteRepository.count({ where: { curso: { id: Number(id) } } });
            console.log(`Número de estudiantes cursando el curso: ${estudiantesAsignados}`);
            if (estudiantesAsignados > 0) {
                throw new Error('Estudiante cursando materia, no se puede eliminar');
            }
            const curso = yield cursoRepository.findOne({ where: { id: Number(id) } });
            if (!curso) {
                throw new Error('El curso no existe');
            }
            // Verificar si el curso existe
            const deleteResult = yield cursoRepository.delete(id);
            console.log(`Resultado de la eliminación: ${JSON.stringify(deleteResult)}`);
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: 'Curso eliminado' });
            }
            else {
                throw new Error('Curso no encontrado');
            }
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ mensaje: err.message });
        }
        else {
            res.status(400).json({ mensaje: 'Error' });
        }
    }
});
exports.eliminar = eliminar;
