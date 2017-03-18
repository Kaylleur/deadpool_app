/**
 * Created by thomas on 10/03/17.
 */


module.exports = {
    getUsers : function(req,res) {
        res.status(200).send({code : 200, message : "Users !"});
    }
};