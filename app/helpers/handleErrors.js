function routeFunctionErrorHandler(res, error, req) {
    if (error.code === 'ECONNREFUSED') {
        error.message += messages.SERVICE_UNAVAILABLE;
    }
    else if (error && error.stack && error.statusCode && error.message && !error.isAxiosError) {
        res.status(200, error);
        //throw new Error(error);
    }

}

function postgresErrorHandler(error) {
    console.log("POSTGRES ERROR: ", error.detail, " - ", error.message);
    process.exit(1);
}

module.exports = {
    routeFunctionErrorHandler,
    postgresErrorHandler
}