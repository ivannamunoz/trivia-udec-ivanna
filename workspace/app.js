var express 	= 	require("express"),
	app			= 	express(),
	cons 		=	require("consolidate"),
	puerto 		= 	process.env.PORT || 8081,
	bodyParser 	= 	require('body-parser'),
	mysql   	= 	require('mysql');




var conexion = mysql.createConnection({
  host     	: 'localhost',
  user     	: 'root',
  password 	: '',
  database 	: 'trivia'
});

conexion.connect();


//consolidate integra swig con express...
app.engine("html", cons.swig); //Template engine...
app.set("view engine", "html");
app.set("views", __dirname + "/vistas");
app.use(express.static('public'));
//Para indicar que se envía y recibe información por medio de Json... se llaman los metodos por separado
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res)
{
	res.render("index");
});



app.get('/getQuestions', function(req, res)
{
	//trae todas las preguntas
	var sql = "select numpregunta, pregunta, opcion1, opcion2, opcion3, opcion4 from preguntas order by rand()";
	queryMysql(sql, function(err, data){
		if (err) throw err;
		res.json(data);
	});

});






app.post('/isValid', function (req, res)
{
	
	//valida si la respuesta es correcta
	var sql = "SELECT correcta from preguntas where numpregunta = " + req.body.numPregunta;
	var respuestaUsuario= req.body.respuesta;
	
	
	queryMysql(sql, function(err, data)
	{
		if (err) throw err;
		res.json({
					//compara la respuesta del json con la respuesta ingresada por el usuario
					respuestaCorrecta : data[0].correcta,
					correcto	: data[0].correcta === respuestaUsuario ? true : false
		});
	});


});





app.get("*", function(req, res)
{
	res.status(404).send("Página no encontrada :( en el momento");
});



//Consulta la base de datos
var queryMysql = function(sql, callback)
{
	conexion.query(sql, function(err, rows, fields)
	{
		if (err) throw err;
		callback(err, rows);
	});
};
app.listen(puerto);
console.log("Express server iniciado en el " + puerto);