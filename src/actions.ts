import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Users } from './entities/Users'
import { Exception } from './utils'

//Crea un usuario
export const createUser = async (req: Request, res:Response): Promise<Response> =>{
	// important validations to avoid ambiguos errors, the client needs to understand what went wrong
	if(!req.body.first_name) throw new Exception("Please provide a first_name")
	if(!req.body.last_name) throw new Exception("Please provide a last_name")
	if(!req.body.sexo) throw new Exception("Please provide a sexo")
	if(!req.body.cedula) throw new Exception("Please provide a cedula")
	if(!req.body.rol) throw new Exception("Please provide a rol")
	if(!req.body.fechaIngreso) throw new Exception("Please provide a fechaIngreso")

	const userRepo = getRepository(Users)
	// fetch for any user with this email
	const user = await userRepo.findOne({ where: {cedula: req.body.cedula }})
	if(user) throw new Exception("Ya existe un usuario con esta cedula")

	const newUser = getRepository(Users).create(req.body);  //Creo un usuario
	const results = await getRepository(Users).save(newUser); //Grabo el nuevo usuario 
	return res.json(results);
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
    await getRepository(Users).delete(USUARIO);

	return res.json({ message: "El usuario fue eliminado con exito" })
}

//Elimina un usuario
export const deleteUser = async (req: Request, res: Response): Promise<Response> =>{
    const usuarioRepo = getRepository(Users);
    const USUARIO = await usuarioRepo.findOne({ where: { id: req.params.id } });
    if (!USUARIO) throw new Exception("El usuario no existe");

    const result = await usuarioRepo.delete(USUARIO);
    return res.json({ message: "Ok", result: result });
}