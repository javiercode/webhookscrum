"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const router = express.Router();
const restService = express();
const { CohereClient } = require("cohere-ai");
require('dotenv').config();


restService.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).send('Error del servidor');
  });

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());



restService.get("/politica", function(req, res) {
  res.sendFile(path.join(__dirname+'/politica.html'));
});

restService.post("/chatbot", async function(req, res,next) {
    var speech ='No se puede buscar el titulo solicitado.';
    var aQueryText=req.body.queryResult.queryText.split(':');

    var respuesta = function (res, speech) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send({
            "fulfillmentText": speech,
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [speech]
                    }
                }
            ],
            "source": "<webhookscrum>"
        });
        return ;
        // next()
    };

    const cohere = new CohereClient({
        // token: "hJsplBPOJPEYYjBp72aKrhnCl6koe6KvsLsZE23C",    
        token: process.env.TOKENIA,    
      });

    if(aQueryText.length==2){
        let speech ={text:"Nose puede procesar la respuesta"};
        try {
            // var parametro=req.body.queryResult.parameters?.any;
            // console.log("parametro",parametro);
            var prompt = aQueryText[1];
            prompt= prompt.trim();
            console.log("prompt",prompt);

            speech = await cohere.chat({
                message: prompt,  
            });
        } catch (error) {
            speech ={text:"Error al procesar la solicitud"};
        }
        
        respuesta(res, speech.text);
    }else{
        speech ='El formato de la solicitud no es la correcta';
        respuesta(res, speech);
    }

});



restService.listen(process.env.PORT || 3000, function() {
  console.log("Server up and listening");
});