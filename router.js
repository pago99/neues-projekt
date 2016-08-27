// requirements
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

// body-parser wird gebraucht um POST-request entgegenzunehmen
// bei Google findet man Aussagen wie: Sicherheitsrisiko bei express + body-parser
// das hier ist aber die Verwendung, wie sie auch bei express 4.0 empfohlen wird
router.use(bodyParser.urlencoded({ extended: true }));

// ".get" bei ganz normaler Seitenauslieferung
// über ".params" kann auch auf GET-Parameter zugegriffen werden
// hier aber nicht nötig!
router.get('/', function(req, res) {
    res.sendFile('view/index.html', {root: __dirname });
});

// am Ende wird der router exportiert,
// da er ja in der index.js eingebunden wird
module.exports = router;
