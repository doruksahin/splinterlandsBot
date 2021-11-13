
let classes = {
    Response: class Response {
        constructor(message, data) {
            this.statusCode = 200;
            this.error = false;
            this.message = message || `Success!`;
            this.data = data || [];
        }
    }
}

module.exports = { ...classes }