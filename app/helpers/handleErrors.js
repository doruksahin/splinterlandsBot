function routeFunctionErrorHandler(res, error, req) {
    if (error.code === 'ECONNREFUSED') {
        error.message += messages.SERVICE_UNAVAILABLE;
    }
    else if (error && error.stack && error.statusCode && error.message && !error.isAxiosError) {
        res.status(200, error);
        //throw new Error(error);
    }

}

module.exports = {
    routeFunctionErrorHandler
}