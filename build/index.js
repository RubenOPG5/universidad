"use strict";
//npm init -y                 package.json
//npm i typescript -D         complilador dependencia de desarrollo
//tsc --init                  inicilizamos para typescript tsconfig.json 
//npm i ts-node-dev           compilacion automatica con js  
//modifico el script
//npm i express               
//npm i cors
//npm i morgan                 login de lo que se pida a la API
//
//npm i @types/express -D      le dice los tipos de datos para que soporte los datos
//npm i @types/cors -D         para que typescripct trabaje con cors
//npm i @types/morgan -D       para que typescript trabaje con morgan
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//TYPEORM
//npm install typeorm --save
//npm install reflect-metadata --save
//npm install @types/node --save-dev
//npm install mysql2 --save
//ò e installa todo lo del package
//npm install   instala todo lo del package
// npm run dev  para levantar el servidor
const app_1 = __importDefault(require("./app"));
const conexion_1 = require("./db/conexion");
const port = 6505;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, conexion_1.initializeDatabase)();
            console.log('Base de datos conectada');
            app_1.default.listen(6505, () => {
                console.log(`Servidor activo en el puerto ${port}`);
            });
        }
        catch (err) {
            if (err instanceof Error) {
                console.log('Error al conectar con la base de datos:', err.message);
            }
        }
    });
}
main();
