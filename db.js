const sqlite3 = require("sqlite3").verbose()

const dbFile = "db.sqlite3"

// Se connecter a la base de données
const db = new sqlite3.Database(dbFile, (err) => {
    if(err){
        console.error(err.message)
        throw err

    }else{
        console.log("Connexion avec succès a la base de données...");
        const sql = `CREATE TABLE article (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resume text,
            contenu text,
            auteur text,
            date_de_création text,
            date_de_dernière_mise_à_jour text
        )`
        // interagir avec la base de données 
        db.run(sql, (err) => {
            if(err) {
                console.log('La table est deja créée');
            }
        })
    }
})

module.exports = db;