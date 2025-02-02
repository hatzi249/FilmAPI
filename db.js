const sql = require('mssql');
const config = require('./config');

get = async (req, res, endpoint, hateoas = [], ...params) => {
    try {
        let parameters = '';
        params.forEach(param => parameters += `, ${param}`);

        let query = req.params.Id > 0 ? 
            `EXEC Get${endpoint}ById ${req.params.Id}${parameters}` :
            `EXEC Get${endpoint}s ${parameters.length < 2 ? '' : parameters.substring(2)}`;

            await sql.connect(config);
            const result = await sql.query(query);

            if (result.recordset.length == 0) { 
                res.status(404); 
                return result;
            }

            //hateoas.push({ property: 'Id', endpoint: `${endpoint}s` })

            //const records = createHateoasLinks(req, result, hateoas);

        return req.params.Id > 0 ? result[0] : result;
    }
    catch (err){
        console.log(err);
        throw err;
    }
};

module.exports = { get };