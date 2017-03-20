/**
 * Created by Thomas on 18/03/2017.
 */

module.exports = {
    validateUser : function(user){

        let err = [];

        if(!user.name) err.push({message:"name invalid",id:101});
        if(!user.amount || !Number.isInteger(user.amount)) err.push({message:"amount invalid",id:102});
        if(!Number.isInteger(user.creditCard.expirationDate)) err.push({message:"credit card expiration date invalid",id:201});
        if(!Number.isInteger(user.creditCard.numbers) || user.creditCard.numbers.length == 16) err.push({message:"credit card numbers invalid",id:202});
        if(!Number.isInteger(user.creditCard.cvv) || user.creditCard.cvv.length == 3) err.push({message:"credit card cvv invalid",id:203});

        return err;
    }
};