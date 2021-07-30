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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.forgotPassword = exports.deleteUser = exports.getUser = exports.getAllUsers = exports.createUser = exports.login = void 0;
var typeorm_1 = require("typeorm"); // getRepository"  traer una tabla de la base de datos asociada al objeto
var Users_1 = require("./entities/Users");
var utils_1 = require("./utils");
var controller_1 = require("./email/controller");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Encripta
var bcrypt = require('bcrypt');
//LOGIN- DEVUELVE UN TOKEN DE AUTORIZACION AL USUARIO
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var USUARIO, token, validacionPassword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.email)
                    throw new utils_1.Exception("Por favor ingrese email en el body", 400);
                if (!req.body.password)
                    throw new utils_1.Exception("Por favor ingrese password en el body", 400);
                return [4 /*yield*/, typeorm_1.getRepository(Users_1.Users).createQueryBuilder("user")
                        .where("user.name = :name", { name: req.body.email })
                        .orWhere("user.email = :email", { email: req.body.email })
                        .getOne()];
            case 1:
                USUARIO = _a.sent();
                if (!USUARIO)
                    throw new utils_1.Exception("El email o la contraseña es inválida", 401);
                token = '';
                return [4 /*yield*/, bcrypt.compare(req.body.password, USUARIO.password)];
            case 2:
                validacionPassword = _a.sent();
                validacionPassword ? token = jsonwebtoken_1["default"].sign({ USUARIO: USUARIO }, process.env.JWT_KEY) : token = 'Invalid password';
                if (token === 'Invalid password')
                    throw new utils_1.Exception("El email o la contraseña es inválida");
                return [2 /*return*/, res.json({ message: "Ok", token: token, usuario: USUARIO })];
        }
    });
}); };
exports.login = login;
//Crea un usuario
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var USUARIO, userRepo, userEmail, userAdress;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // important validations to avoid ambiguos errors, the client needs to understand what went wrong
                if (!req.body.name)
                    throw new utils_1.Exception("Please provide a name");
                if (!req.body.address)
                    throw new utils_1.Exception("Please provide a address");
                if (!req.body.email)
                    throw new utils_1.Exception("Please provide a email");
                if (!req.body.password)
                    throw new utils_1.Exception("Please provide a password");
                USUARIO = new Users_1.Users();
                USUARIO.name = req.body.name;
                USUARIO.address = req.body.address;
                USUARIO.email = req.body.email;
                USUARIO.password = req.body.password;
                userRepo = typeorm_1.getRepository(Users_1.Users);
                return [4 /*yield*/, userRepo.findOne({ where: { email: USUARIO.email } })];
            case 1:
                userEmail = _a.sent();
                if (userEmail)
                    throw new utils_1.Exception("Ya existe un usuario con esta email");
                return [4 /*yield*/, userRepo.findOne({ where: { address: USUARIO.address } })];
            case 2:
                userAdress = _a.sent();
                if (userAdress)
                    throw new utils_1.Exception("Ya existe un usuario con esta direccion");
                //Encriptamos la pass y la guardamos encriptada
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        console.log(err);
                    }
                    bcrypt.hash(req.body.password, salt, function (err, hash) { return __awaiter(void 0, void 0, void 0, function () {
                        var nuevoUsuario, results;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err) {
                                        console.log(err);
                                    }
                                    //GUARDAR EN BASE DE DATOS
                                    USUARIO.password = hash;
                                    nuevoUsuario = typeorm_1.getRepository(Users_1.Users).create(USUARIO);
                                    return [4 /*yield*/, typeorm_1.getRepository(Users_1.Users).save(nuevoUsuario)];
                                case 1:
                                    results = _a.sent();
                                    controller_1.enviarMail(USUARIO.email, "Verify account", "");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [2 /*return*/, res.json({ message: "ok" })];
        }
    });
}); };
exports.createUser = createUser;
//Trae todos los usuarios
var getAllUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.getRepository(Users_1.Users).find()];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.json(users)];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
//Trae solo un usuario
var getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var USUARIO;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.getRepository(Users_1.Users).findOne({ where: { id: req.params.id } })];
            case 1:
                USUARIO = _a.sent();
                if (!USUARIO)
                    throw new utils_1.Exception("El usuario no existe");
                return [2 /*return*/, res.json(USUARIO)];
        }
    });
}); };
exports.getUser = getUser;
//Elimina un usuario
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usuarioRepo, USUARIO, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                usuarioRepo = typeorm_1.getRepository(Users_1.Users);
                return [4 /*yield*/, usuarioRepo.findOne({ where: { id: req.params.id } })];
            case 1:
                USUARIO = _a.sent();
                if (!USUARIO)
                    throw new utils_1.Exception("El usuario no existe");
                return [4 /*yield*/, usuarioRepo["delete"](USUARIO)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.json({ message: "Ok", result: result })];
        }
    });
}); };
exports.deleteUser = deleteUser;
//ENVÍA EMAIL CON UNA NUEVA CONTRASEÑA RANDOM
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var USUARIO, random;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.email)
                    throw new utils_1.Exception('Por favor ingrese un email');
                return [4 /*yield*/, typeorm_1.getRepository(Users_1.Users).findOne({ where: { email: req.body.email } })];
            case 1:
                USUARIO = _a.sent();
                if (!USUARIO)
                    throw new utils_1.Exception("Este usuario no existe");
                random = Math.random().toString(36).substring(17);
                console.log(random);
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        console.log(err);
                    }
                    bcrypt.hash(random, salt, function (err, hash) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err) {
                                        console.log(err);
                                    }
                                    //GUARDAR EN BASE DE DATOS
                                    USUARIO.password = hash;
                                    return [4 /*yield*/, typeorm_1.getRepository(Users_1.Users).save(USUARIO)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                controller_1.enviarMail(USUARIO.email, 'Forgot password', random);
                // enviarMail(USUARIO.email, USUARIO.nombre, 'Recuperar contraseña', random, USUARIO.id);
                return [2 /*return*/, res.json({ message: "ok", usuario: USUARIO })];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
// export const sendEmail = async (req: Request, res: Response): Promise<Response> => {
//     if(!req.body.email) throw new Exception("Ingrese un email")
//     enviarMail(req.body.email);
//     return res.json({messge: "ok"})
// }
