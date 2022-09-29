const readXlsxFile = require('read-excel-file/node')
const fs = require("fs");



// // File path.
let katashiki=[];
let baris=[];
let dataExcel={};
let katashikiConv=[];
let typeKatashiki;
let groupKatashiki=[];
let indexGroup=0;
let katashikiJsonPrev={model:0,warna:0,type:0};
let counterKatashiki;

const model={
  'D40L':1,
  'D40D':4,
	'JUMP':4,
  'SWING':4,
  'CUT':4,	
  'D17D':5,	
  'D26':6,	
  'T26':7,
  'LOW':8,
  'TOYOTA':9,
  
	'D12L':2,
  'AERO':2,
  
	'HIGHT':3
  // 'RR':40

}

const warna={
	'1G3': 1,	
	'T23': 2,	
	'1E7': 4,	
	'X12': 6,	
	'3Q3': 7,	
	'W09': 9,	
	'R71': 11,	
	'4T3': 12,	
	'X13': 14,	
	'X09': 16,
	'S28': 19,	
	'P20': 20,	
	'G64': 21,	
	'R75': 17
}



// convert katashiki to JSON model, warna, dan type
function convert(item){
  if(!item){
    return item // handle null
  } 

  const data = `${item}`.split(/[ -]+/); // split data katashiki name 
  
  if(!model[data[0]]){
    if(data[0]==='RR'){
      return {"model":40,"warna":warna[data[3]],"type":3}
    }
      else return item
  }

  if(!warna[data[1]]){  //jika warna gabung dengan tipe ex: 4T3FR-FR
    data[1] = data[1].substr(0,3);
  } 
  
  data[2]==='FR'?typeKatashiki=2:typeKatashiki=1;  //jika ada tambahan FR-FR type jd FR-FR
    
  return {"model":model[data[0]],"warna":warna[data[1]],"type":typeKatashiki}
  }

readXlsxFile(fs.createReadStream('20 SEPTEMBER 2022.xlsx')).then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
  for (let index = 0; index < 7; index++) {
    katashiki.push(rows[index+7]);
  }

  for (let indexBaris = 0; indexBaris < 7; indexBaris++) {
    
    for (let i = 1; i < 65; i++) {
      if(katashiki[indexBaris][i]!=null)katashikiConv.push(katashiki[indexBaris][i])
    }
  }
  katashikiConv.filter(Number); //remove null element 
  
  // groupKatashiki[indexGroup].push(katashikiConv[0])
  // groupKatashiki[`1-${katashikiConv[1]}`] = convert(katashikiConv[1])

  console.log(katashikiConv.length);
  
  for (let indexKatashiki = 0; indexKatashiki < katashikiConv.length; indexKatashiki++) {
    const katashikiJson = convert(katashikiConv[indexKatashiki]);


    
    if(katashikiJson.model)
    {
      if(katashikiJson.model!=katashikiJsonPrev.model||katashikiJson.warna!=katashikiJsonPrev.warna|| katashikiJson.type!=katashikiJsonPrev.type){
        indexGroup++;
        counterKatashiki=0;
      }
    }
    counterKatashiki++;
    groupKatashiki[`${indexGroup}-${katashikiConv[indexKatashiki]}`] = {...katashikiJson,counter:counterKatashiki};
    katashikiJsonPrev = katashikiJson;
  }
    console.log(groupKatashiki);

      
})