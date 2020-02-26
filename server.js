// configurando o servidor
const express = require("express");
const server = express();

// configurar o servidor para apresentar arquivos extras
server.use(express.static('public'));

// habilitar body do formulário
server.use(express.urlencoded({extended: true}));

// configurar a cconexão com o banco de dados
const Pool = require('pg').Pool;
const db = new Pool ({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});

// configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true
});

/*
// lista de doadores: array
const donors = [
    {
        name: "Jhonny Oliveira",
        blood: "O-"
    },
    {
        name: "Alice Maria",
        blood: "B+"
    },  {
        name: "Diego Silva",
        blood: "AB-"
    },  {
        name: "Maria Zelma",
        blood: "A-"
    },
]*/

// configurar a apresentação da página
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados.");

        const donors = result.rows;

        return res.render("index.html", {donors});
    });
});

server.post("/", function(req, res){
    // pegar dados dos dormulários
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    /*
    // coloca os valores no array
    donors.push({
        name: name,
        blood: blood
    });*/

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios")
    };

    // coloca os valores no banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`;

    const values = [name, email, blood];

    db.query(query, values, function(err){
        // fluxo de erro
        if (err) return res.send("Erro no banco de dados.");

        // fluxo ideal
        return res.redirect("/");
    });  
});


// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log("iniciei o servidor.");
});