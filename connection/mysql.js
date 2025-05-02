const mysql = require('mysql')

async function connectMySQL() {
    const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "",
        database : "db_portfolio"
    })
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err)
                return;
            }
            else{resolve}
        })
    })
}

module.exports = {
    connectMySQL
}