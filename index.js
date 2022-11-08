require("dotenv").config();
const express = require("express");
//Mysql é o nome de uma variável, pode ser qualquer coisa
//Mysql parece mais intuitivo do que mysql2
const mysql = require("mysql2");
const app = express();
app.use(express.json());

const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  //se todas as conexões estiverem ocupadas, novos solicitantes esperam numa fila
  //se configurado com false, causa um erro quando recebe requisições e todas
  //as conexões estão ocupadas
  waitForConnections: true,
  //no máximo 10 conexões. Elas são abertas sob demanda e não no momento de
  //construção do pool
  connectionLimit: 10,
  //quantos solicitantes podem aguardar na fila? 0 significa que não há limite
  queueLimit: 0,
});

app.get("/medico", (req, res) => {
  pool.query("SELECT * FROM tb_medico", (err, results, fields) => {
    res.json(results);
  });
});

app.post("/medico", (req, res) => {
  const crm = req.body.crm;
  const nome = req.body.nome;

  const sql = "INSERT INTO tb_medico (crm, nome) VALUES (?, ?)";
  pool.query(sql, [crm, nome], (err, results, fields) => {
    res.json(results);
  });
});

app.get("/paciente", (req, res) => {
  pool.query("SELECT * FROM tb_paciente", (err, results, fields) => {
    res.json(results);
  });
});

app.post("/paciente", (req, res) => {
  const cpf = req.body.cpf;
  const nome = req.body.nome;
  const idade = req.body.idade;

  const sql = "INSERT INTO tb_paciente (cpf, nome, idade) VALUES (?, ?, ?)";
  pool.query(sql, [cpf, nome, idade], (err, results, fields) => {
    res.json(results);
  });
});

app.get("/consulta", (req, res) => {
  const sql = ` SELECT m.nome as nome_medico, c.data_hora, p.nome 
                AS nome_paciente
                FROM tb_medico m, tb_consulta c, tb_paciente p
                WHERE m.crm = c.crm AND c.cpf = p.cpf`;
  pool.query(sql, (err, results, fields) => {
    res.json(results);
  });
});

app.post("/consulta", (req, res) => {
  const crm = req.body.crm;
  const cpf = req.body.cpf;
  const data_hora = req.body.data_hora;

  const sql = "INSERT INTO tb_consulta (crm, cpf, data_hora) VALUES (?, ?, ?)";
  pool.query(sql, (err, results, fields) => {
    res.json(results);
  });
});

const porta = 3000;
app.listen(porta, () => console.log(`Executando. Porta ${porta}`));