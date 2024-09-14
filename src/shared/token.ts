import { nanoid } from "nanoid";

type TokenOptions = {
	size?: number
};

export class Token {
    static generate(opts?: TokenOptions) {
		if(opts){
			return nanoid(opts.size);
		}

		return nanoid();
	}
}
