import { hash, compare } from "bcrypt";

export class Crypt{
	static async hash(plainText, salt = 10){
		return await hash(plainText, salt);
	}
}