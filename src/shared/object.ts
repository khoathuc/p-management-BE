const _ = require("lodash");

export class OBJ{

	/**
	 * @desc pick object fields.
	 * @param object 
	 * @param fields 
	 */
	static pick<T, K extends keyof T>(object:T, fields: K[]){
		return _.pick(object, fields);
	}
}