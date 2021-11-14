const router = require("express").Router();
const service = require("./service");
const houseKeeping = require("./houseKeeping");

const { Response } = require('./helpers/responses');
const { routeFunctionErrorHandler } = require('./helpers/handleErrors');



router.get("/detailedAnalyse", async (req, res) => {
    const responseEntity = new Response();
    const { mana, rule, red, green, blue, black, white, gold } = req.body;
    try {
        responseEntity.data = await service.getDetailedAnalyse(mana, rule, red, green, blue, black, white, gold).catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (exception) {
        routeFunctionErrorHandler(res, exception, null);
    }
});


router.get("/generalAnalyseSummoner", async (req, res) => {
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


router.get("/runHouseKeeping", async (req, res) => {
    const responseEntity = new Response();
    try {
        responseEntity.data = await houseKeeping.saveBattles().catch(error => {
            throw error;
        });
        res.status(responseEntity.statusCode).json(responseEntity.data);
    } catch (exception) {
        routeFunctionErrorHandler(res, exception, null);
    }
});



module.exports = router;