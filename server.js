const express = require('express');
// importation de db depuis le fichier db.js
const db = require("./db.js");

const app = express();

// MiddleWare
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const port = 3000;

app.get('/', function(req, res,) { 
  res.json( { message:" Hello World! "});
});


//lister les articles
app.get('/api/articles', (req, res) => {
  const sql = "SELECT * FROM article";
  //const params = []
  db.all(sql, (err, rows) => {
    if(err){
      res.status(400).json({msg: 'error '});
        return
      }
    res.json({message: "Liste des des articles", data: rows })
  })
})


//Blog verbose
const blog = [
  {id: 1, nom: 'article 1'},
  {id: 2, nom: 'article 2'},
  {id: 3, nom: 'article 3'},
  {id: 4, nom: 'article 4'},
  {id: 5, nom: 'article 5'},
  {id: 6, nom: 'article 6'},
  {id: 7, nom: 'article 7'},
  {id: 8, nom: 'article 8'},
  {id: 9, nom: 'article 9'},
  {id: 10,nom: 'article 10'},
  
]

// le point de terminaison blog
app.get('/api/articles/blog', (req,res) => {
  const page = parseInt( req.query.page)
  const limit = parseInt(req.query.limit)

  const startIndex = ( page - 1) * limit
  const endIndex = page * limit

  const results = {}

  if(endIndex < blog.length){
    results.next ={
      page: page + 1,
      limit: limit
    }
  }
  

  if(startIndex > 0){
    results.previous = {
      page: page - 1,
      limit: limit
    }
  }
  

  results.results = blog.slice(startIndex, endIndex)
  res.json(results)
})

// afficher un article a travers son id
app.get('/api/articles/:id', (req, res)=>{
  const {id: articleID} = req.params
  const sql = "SELECT * FROM article WHERE id = ?";
  const params = [articleID]
  db.get(sql, params,(err, row) => {
    if(err){
      console.log("ca va id")
     res.status(400).json({msg: 'err' });
     return
    }
    res.json({message: `Afficher l'article de l'${articleID}`, data: row })
  })
})

// creer un article
app.post('/api/articles', (req, res) => {
  //const titre = req.body.nom
  // const résumé = req.body.phone

  const { resume, contenu, auteur, date_de_création, date_de_dernière_mise_à_jour } = req.body;
    
  if(!resume || !contenu || !auteur || !date_de_création || !date_de_dernière_mise_à_jour ){
  res.status(400).json({error:"remplire tout et tout"});
  return; 
  }

  const article = {resume, contenu, auteur, date_de_création, date_de_dernière_mise_à_jour};
  const sql = 'INSERT INTO article (resume, contenu, auteur, date_de_création, date_de_dernière_mise_à_jour) VALUES (?,?,?,?,?)'
  const params = [article.resume, article.contenu, article.auteur, article.date_de_création, article.date_de_dernière_mise_à_jour]
  // executer la base donnees
  db.run(sql, params, function(err, result){
  if(err){
    res.status(400).json({msg: 'error '});
      return
    }
    res.status(201).json({message:"Article cree avec succes ", data: article });
    })

   
});

// modifier un article
app.put('/api/articles/:id', (req, res) => {
  //const titre = req.body.nom
  // const résumé = req.body.phone
  const {id: articleID} = req.params
  const { resume, contenu, auteur, date_de_création, date_de_dernière_mise_à_jour } = req.body;
    
  if(!resume || !contenu || !auteur || !date_de_création || !date_de_dernière_mise_à_jour ){
  res.status(400).json({error:"remplire tout et tout"});
  return; 
  }

  const article = {resume, contenu, auteur, date_de_création, date_de_dernière_mise_à_jour};
  const sql = 'UPDATE  article SET resume = ?, contenu = ?, auteur = ?, date_de_création = ?,  date_de_dernière_mise_à_jour = ? WHERE id = ?'
  const params = [article.resume, article.contenu, article.auteur, article.date_de_création, article.date_de_dernière_mise_à_jour, articleID]
  // executer la base donnees
  db.run(sql, params, function(err, result){
  if(err){
    res.status(400).json({msg: 'error '});
      return
    }
    res.status(201).json({message:`Article ${articleID} modifie avec succes `, data: article });
    })

   
});

//supprimer un article
app.delete("/api/articles/:id", (req, res) =>{
  const {id: articleID} = req.params;
  const sql = "DELETE FROM article WHERE id = ?"
  db.run(sql, articleID, function(err, resultat){
    if (err){
      resultat.status(400).json({msg: 'err'})
      return
    }
    res.json({message: `Article ${articleID}  supprimé avec succès`, data: this.changes})
  })
})
// demarrer le serveur
app.listen(port, () => {
  //console.log("L'Application a demarré sur le port: " + port);  
  console.log(`L'Application est ecoutée  sur le port ${port}`);
})