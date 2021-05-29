// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database(':memory:');


// db.serialize(function() {});
// function add() {
//     db.run("CREATE TABLE lorem (info TEXT)");

//     var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (var i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }

//     stmt.finalize();
// }

// function read() {
//     var rows = document.getElementById("database");
//     db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
//         var item = document.createElement("li");
//         item.textContent = "" + row.id + ": " + row.info;
//         rows.appendChild(item);
//     });
// }


const DB_API = {
    add: (callback) => {
        // client.invoke("test", (error, result) => {
        //     if (error) {
        //         console.log(error)
        //         // docker need message
        //         document.querySelector('#dockerless').style.display = 'block'
        //         return null
        //     } else {
        //         callback(result)
        //     }
        // })
        console.log('i was added!')
    },
    read: (callback) => {
        // client.invoke("get_message_template_handler", host, method, metadata, (error, result) => {
        //     if (error) {
        //         console.log(error)
        //         return null
        //     } else {
        //         console.log(error)
        //         callback(result)
        //     }
        // })
        console.log('i was readed!')        
    }
}

Object.freeze(DB_API)
module.exports = { DB_API }
