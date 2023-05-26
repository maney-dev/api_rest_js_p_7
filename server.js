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
  {id: 1, Titre: ' Économie maritime et insularité', Contenu:"Les Cahiers d'Outre-mer",detail:"le cas des îles tropicales", auteur: 'Jean-Claude Maillard', date_de_création:'mars 1978', date_de_dernière_mise_à_jour:'avril 2022'},
  {id: 2, Titre: 'REST, un style d\'architecture universel', contenu:'Introduction au style d\'architecture REST...', detail:'Historique de REST, HTTP,GET, et POST...', auteur: 'Jean-Paul Figer', date_de_création: 'le 15/08//2005', date_de_dernière_mise_à_jour: 'l2 22/09/2006'},
  {id: 3, Titre: 'Peer-to-Peer (P2P),Pair a Pair et cie', contenu:'L\'histoire et les caractéristiques des systèmes Peer to Peer', detail:'ICQ: les pionniers, La saga Napster...', auteur: 'Mark', date_de_création: 'le 12/09/2001', date_de_dernière_mise_à_jour: 'le 12/09/2001'},
  {id: 4, Titre: 'Les autoroutes de l\'informatique', contenu:'vers la societé de l\'information', detail:'une révolution, L\'age de l\'information, les enjeux, un défi pour les entreprises', auteur: 'Kravanbert', date_de_création: 'le 24/04/1996', date_de_dernière_mise_à_jour: 'le 24/04/1996'},
  {id: 5, Titre: 'Une robe pour la Princesse', contenu:'Une parabole pour les informaticiens', detail:'ironie sur la maniere de travailler des informaticiens, leur mode de vi...', auteur: 'Jean.P Figer', date_de_création: 'le 16/02/1989', date_de_dernière_mise_à_jour: 'le 16/02/1990'},
  {id: 6, Titre: 'Comment cabler sa maison ou son appartement', contenu:'AUTOBIOGRAPHIE...', detail:'conseils pratiques pour installer son appartement ou sa maison. Avec ou sans fils ? CPL ou Wifi ?', auteur: 'Jean-Paul Figer', date_de_création: 'le 01/06/2004', date_de_dernière_mise_à_jour: ' le 26/03/2018'},
  {id: 7, Titre: 'L\'internet des objets a la maison ', contenu:'conseils pratiques pour surveiller et controler...', detail:'L\'Afrique libre...', auteur: 'Inconnu', date_de_création: 'mars 2020', date_de_dernière_mise_à_jour: 'le 07/10/2019'},
  {id: 8, Titre: 'Starlink,Internet haut-debit par satellite', contenu:'les satellites a haut-debit', detail:'Installation du test de Starlink sur...', auteur:'Starlink',date_de_création: 'aout 2021', date_de_dernière_mise_à_jour: 'le 16/05/2022'},
  {id: 9, Titre: 'Une station météo personnelle', contenu:'Conseils pratiques pour installer...', detail:'les informations dans un système domotique', auteur:'Waldbeck Halley',date_de_création: 'mars 1965', date_de_dernière_mise_à_jour: 'le 01/06/2022'},
  {id: 10, Titre:'Serverless sur Cloud', contenu:'Description d\'une nouvelle offre Cloud...', detail:' le serverless computing avec comme exemple le site www.figer.com', auteur: 'Apple', date_de_création: 'Avril 2018', date_de_dernière_mise_à_jour: 'le 19/03/2020'},
  
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
app.get('/api/articles/:contenu', (req, res)=>{
  const {contenu: articleDetail} = req.params
  const sql = "SELECT * FROM article WHERE contenu = ?";
  const params = [articleDetail]
  db.get(sql, params,(err, row) => {
    if(err){
      console.log("ca va contenu")
     res.status(400).json({msg: 'err' });
     return
    }
    res.json({message: `Afficher l'article de l'${articleDetail}`, data: row })
  })
})

// detail article
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