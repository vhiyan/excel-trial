const readXlsxFile = require('read-excel-file/node')
const fs = require("fs");


// // File path.
let katashiki=[];
let baris=[];
let dataExcel={};


function convert(item)
{

}


readXlsxFile(fs.createReadStream('20 SEPTEMBER 2022.xlsx')).then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
  for (let index = 0; index < 7; index++) {
    katashiki.push(rows[index+7]);
  }
  for (let j = 0; j < 5; j++) {
    
      for (let i = 1; i < 65; i++) {
          baris.push(katashiki[j][i]);
        }
       
    }
    
    for (let jmlBaris = 0; jmlBaris < baris.length; jmlBaris++) {
        
      console.log(baris[0]);
    }
        
      
})