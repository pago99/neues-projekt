// requirements
var express = require('express');
// Nur damit wir es nicht vergessen: body-parser
// für "persistent" nicht nötig (als module deshalb entfernt, hier nur als Doku)
// var bodyParser = require('body-parser');
var router = express.Router();

// body-parser wird gebraucht um POST-request entgegenzunehmen
// bei Google findet man Aussagen wie: Sicherheitsrisiko bei express + body-parser
// das hier ist aber die Verwendung, wie sie auch bei express 4.0 empfohlen wird
// router.use(bodyParser.urlencoded({ extended: true }));

// ".get" bei ganz normaler Seitenauslieferung
// über ".params" kann auch auf GET-Parameter zugegriffen werden
// hier aber nicht nötig!
router.get('/', function(req, res) {
    // Beispiel: req.params
    /*
    var getParams = req.params;
    // Ergebnis so aufgebaut: { param1: 'huhu' }, wenn Route = '/:param1'
    // und URL = http://www.persistent.com/huhu
    */
    res.sendFile('view/index.html', {root: __dirname });
});

// ".post" ist das Pendant zu ".get"
// Problem ist nur, dass man ohne body-parser nicht an die über POST
// verschickten Daten rankommt
/*
    router.post('/formTest', function(req, res){
        // req.body enthält die per POST-Formular verschickten Daten
        console.log(req.body);
        // nur eine Testausgabe
        res.send("recieved your request!");
});
*/

// am Ende wird der router exportiert,
// da er ja in der index.js eingebunden wird
module.exports = router;
