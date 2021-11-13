const router = require("express").Router();
const service = require("./service");
const { Response } = require('./helpers/responses');
const { routeFunctionErrorHandler } = require('./helpers/handleErrors');



router.get("/:generalAnalyseSummoner", async (req, res) => {
    const responseEntity = new Response();
    try {
        responseEntity.data = await service.getGeneralAnalyseSummoner().catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (exception) {
        routeFunctionErrorHandler(res, exception, null);
    }
});

router.get("/:analyse", async (req, res) => {
    const responseEntity = new Response();
    const { mana, rule, red, green, blue, black, white, gold } = req.body;
    try {
        responseEntity.data = await service.getGeneralAnalyse(mana, rule, red, green, blue, black, white, gold).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (exception) {
        routeFunctionErrorHandler(res, exception, null);
    }
});



module.exports = router;