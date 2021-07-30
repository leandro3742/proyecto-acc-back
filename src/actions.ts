import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Users } from './entities/Users'
import { Exception } from './utils'

import { enviarMail } from './email/controller';
import jwt from 'jsonwebtoken';

//Encripta
const bcrypt = require('bcrypt');


//LOGIN- DEVUELVE UN TOKEN DE AUTORIZACION AL USUARIO
export const login = async (req: Request, res: Response): Promise<Response> => {

    if (!req.body.email) throw new Exception("Por favor ingrese email en el body", 400);
    if (!req.body.password) throw new Exception("Por favor ingrese password en el body", 400);


    const USUARIO = await getRepository(Users).createQueryBuilder("user")
        .where("user.name = :name", { name: req.body.email })
        .orWhere("user.email = :email", { email: req.body.email })
        .getOne();
    if (!USUARIO) throw new Exception("El email o la contraseña es inválida", 401);
    // if (!USUARIO.activo) throw new Exception("El usuario todavia no esta activo");

    let token = '';
    const validacionPassword = await bcrypt.compare(req.body.password, USUARIO.password)
    validacionPassword ? token = jwt.sign({ USUARIO }, process.env.JWT_KEY as string) : token = 'Invalid password'
    if (token === 'Invalid password') throw new Exception("El email o la contraseña es inválida");

    return res.json({ message: "Ok", token, usuario: USUARIO });


}

//Crea un usuario
export const createUser = async (req: Request, res:Response): Promise<Response> =>{
	// important validations to avoid ambiguos errors, the client needs to understand what went wrong
	if(!req.body.name) throw new Exception("Please provide a name")
	if(!req.body.address) throw new Exception("Please provide a address")
	if(!req.body.email) throw new Exception("Please provide a email")
	if(!req.body.password) throw new Exception("Please provide a password")
	
	//Casteo los datos para no guardar basura en la bd
	const USUARIO = new Users();
	USUARIO.name = req.body.name;
	USUARIO.address = req.body.address;
	USUARIO.email = req.body.email;
	USUARIO.password = req.body.password;

	const userRepo = getRepository(Users)
	//Busco que no exista un usuario con este email
	const userEmail = await userRepo.findOne({ where: {email: USUARIO.email }})
	if(userEmail) throw new Exception("Ya existe un usuario con esta email")

	//Busco que no exista un usuario con esta direccion
	const userAdress = await userRepo.findOne({ where: {address: USUARIO.address }})
	if(userAdress) throw new Exception("Ya existe un usuario con esta direccion")

	//Encriptamos la pass y la guardamos encriptada
	bcrypt.genSalt(10, (err: any, salt: any) => {
        if (err) {
            console.log(err);
        }
        bcrypt.hash(req.body.password, salt, async (err: any, hash: any) => {
            if (err) {
                console.log(err);
            }
            //GUARDAR EN BASE DE DATOS
            USUARIO.password = hash;
            const nuevoUsuario = getRepository(Users).create(USUARIO);  //Creo un usuario
			const results = await getRepository(Users).save(nuevoUsuario); //Grabo el nuevo usuario 
            enviarMail(USUARIO.email, "Verify account", "");
            // enviarMail(USUARIO.email); //Envía email de confirmacion
        })
    })

	return res.json({message: "ok"});
}

//Trae todos los usuarios
export const getAllUsers = async (req: Request, res: Response): Promise<Response> =>{
	const users = await getRepository(Users).find();
	return res.json(users);
}

//Trae solo un usuario
export const getUser = async (req: Request, res: Response): Promise<Response> =>{
    const USUARIO = await getRepository(Users).findOne({ where: { id: req.params.id } });
    if (!USUARIO) throw new Exception("El usuario no existe");
	

	return res.json(USUARIO)
}

//Elimina un usuario
export const deleteUser = async (req: Request, res: Response): Promise<Response> =>{
    const usuarioRepo = getRepository(Users);
    const USUARIO = await usuarioRepo.findOne({ where: { id: req.params.id } });
    if (!USUARIO) throw new Exception("El usuario no existe");

    const result = await usuarioRepo.delete(USUARIO);
    return res.json({ message: "Ok", result: result });
}

//ENVÍA EMAIL CON UNA NUEVA CONTRASEÑA RANDOM
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email) throw new Exception('Por favor ingrese un email');
    const USUARIO = await getRepository(Users).findOne({ where: { email: req.body.email } });
    if (!USUARIO) throw new Exception("Este usuario no existe");
    let random = Math.random().toString(36).substring(17);
    console.log(random);

    bcrypt.genSalt(10, (err: any, salt: any) => {
        if (err) {
            console.log(err);
        }
        bcrypt.hash(random, salt, async (err: any, hash: any) => {
            if (err) {
                console.log(err);
            }
            //GUARDAR EN BASE DE DATOS
            USUARIO.password = hash;
            await getRepository(Users).save(USUARIO);
        })
    })
    enviarMail(USUARIO.email, 'Forgot password', random)
    // enviarMail(USUARIO.email, USUARIO.nombre, 'Recuperar contraseña', random, USUARIO.id);
    return res.json({ message: "ok", usuario: USUARIO });
}

// export const sendEmail = async (req: Request, res: Response): Promise<Response> => {
//     if(!req.body.email) throw new Exception("Ingrese un email")
//     enviarMail(req.body.email);
//     return res.json({messge: "ok"})
// }