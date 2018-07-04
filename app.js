var express = require('express');
var app = express();
var csv = require('csvtojson');
var csvFilePath = 'mcdonalds.csv';
var _ = require('underscore')
var importTools = {}
var myData = [];

importTools.read = function (fileName, callback) {
    var data = [];


    csv({delimiter: ','})
        .fromFile(fileName)
        .on('json', function (jsonObj) {

            data.push(jsonObj)
        })
        .on('done', function (error) {

            if (error) {
                callback(error)
            }
            else if (data.length <= 0) {
                callback('no data found')
            } else {
                callback(null, data)
            }


        })

}

importTools.parse = function (data) {

    return data.map(function (val, index) {
        data[index] = val;

        var state = val.poi.substr(val.poi.indexOf(",") + 1, 2);

        data[index].state = state;

        return val

    })

}


importTools.read(csvFilePath, function (err, res) {

    if (err)
        console.log(err)
    else {
        if (res && res.length > 0) {

            myData = importTools.parse(res);

            console.log("Data loaded ....")

        } else
            console.log('no data found')


    }


})


console.log('starting server .... \n')


app.get('/api/mcdonalds/:id', function (req, res) {

    var mcs = _.filter(myData, function (val) {
        return val.state == req.params.id.toUpperCase()
    })

    if (mcs && mcs.length > 0)
        res.end(JSON.stringify(mcs));
    else if (!mcs || mcs.length <= 0)
        res.send({'error': 'state not valid'});

});


var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('listening on port ', +port)


})
