global.fetch = require("node-fetch");
const fs = require('fs') 
const exec = require('child_process').exec;
let url = 'your json';


const time = setInterval(() => {
  fetch(url)
    .then(function(response){
       // var k =response.json();
        return response.json();
    })
    .then(function (data){
  //  var x = data;
        console.log("------------------------------");
       // console.log(data);
        var obj = data;
     

 var plik  ;

// header for gtfs 
plik = 'header: { gtfs_realtime_version: "1.0" incrementality: FULL_DATASET   timestamp: ';
var y = Date.now();
var czas = String(y); 
//console.log(czas);
plik += czas;
plik +=" }";
var i =0;

// gtfs info i want from json
while( i < obj.result.records.length){

plik +="entity: {id: ";
plik +=JSON.stringify(obj.result.records[i].Nr_Boczny); 
plik +=" vehicle: { position: { latitude: ";   
plik +=JSON.stringify(obj.result.records[i].Ostatnia_Pozycja_Szerokosc); 
plik +=" longitude: ";
plik +=JSON.stringify(obj.result.records[i].Ostatnia_Pozycja_Dlugosc); 
plik +=" } timestamp: ";
var czas = obj.result.records[i].Data_Aktualizacji;
var date = new Date(czas.split(' ').join('T'))
var x = date.getTime() / 1000;


plik +=JSON.stringify(x); 

    plik +=" vehicle: { id: ";
    plik +=JSON.stringify(obj.result.records[i].Nr_Boczny); 
  plik +="}}}";
i++;

}

//save pb massage to file 
var string2 = plik.replace("undefinedentity", " ");
fs.writeFile('Output.test', string2, (err) => { 
      
  // In case of a error throw err. 
  if (err) throw err; 
}) 

//confert pb to binary 
exec ('protoc --encode=transit_realtime.FeedMessage gtfs.proto < Output.test > gtfsvh.pb' , (e,stdout, stderr)=> {
  if (e instanceof Error){
      console.error(e);
      throw e;
  }
  //console.log('stdout', stdout);
 // console.log('stderr', stderr)
});

    return data
    })


  }, 10000);

