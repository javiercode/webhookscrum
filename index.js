"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require('path');
const router = express.Router();
const restService = express();
const { CohereClient } = require("cohere-ai");


restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());



restService.get("/politica", function(req, res) {
  res.sendFile(path.join(__dirname+'/politica.html'));
});

restService.post("/chatbot", async function(req, res) {
    var speech ='No se puede buscar el titulo solicitado.';
    var aQueryText=req.body.queryResult.queryText.split(':');

    var respuesta = function (res, speech) {
        return res.json({
            "fulfillmentText": speech,
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [speech]
                    }
                }
            ],
            "source": "<webhookinra>"
        });
    };

    const cohere = new CohereClient({
        token: "hJsplBPOJPEYYjBp72aKrhnCl6koe6KvsLsZE23C",    
      });

    if(aQueryText.length==2){
        let speech ={text:"Nose puede procesar la respuesta"};
        try {
            var parametro=req.body.queryResult.parameters.comodin;
            parametro= parametro.trim().toLowerCase().replace(':','');

            var prompt = aQueryText[1];
            prompt= prompt.trim();

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


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});