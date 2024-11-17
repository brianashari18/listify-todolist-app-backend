import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {registerUserValidation} from "../validation/user-validation.js";
import bcrypt from "bcrypt";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where : {
            id  : user.id,
        }
    })
    if (countUser === 1) {
        throw new ResponseError(400,"User already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data : user,
        select: {
            id: true,
            email: true
        }
    })

}

export default { register };