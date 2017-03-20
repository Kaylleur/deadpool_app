/**
 * Created by Thomas on 18/03/2017.
 */

module.exports = {
    validateUsers : function(users){

        let err = [];

        if(!users.name) err.push(new Error("name invalid",101));
        if(!users.amount && !Number.isInteger(users.amount)) err.push(new Error("amount invalid",102));
        if(!Number.isInteger(users.creditCard.expirationDate)) err.push(new Error("credit card expiration date invalid",201));
        if(!Number.isInteger(users.creditCard.numbers) && users.creditCard.numbers.length == 16) err.push(new Error("credit card numbers invalid",202));
        if(!Number.isInteger(users.creditCard.cvv) && users.creditCard.cvv.length == 3) err.push(new Error("credit card cvv invalid",203));

        return err;
    }
};