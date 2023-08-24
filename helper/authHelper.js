import bcrypt from 'bcrypt';

//We will get normal 'passowrd' here and will hash it with '.hash' method with saltOrRounds = 10 and return it
export const hashPassword = async(password) => {
    try {
        const saltRounds = 10;
        const hasedPassword = await bcrypt.hash(password,saltRounds);
        return hasedPassword;
    } catch (error) {
        console.log(error)
    }
}

//compare function-> we'll pass normal pass and hased pass and compare them with ".compare" method of bcrypt module
export const comparePassword = async(password,hashPassword) =>{
    return bcrypt.compare(password, hashPassword);
}
