const readXlsxFile = require('read-excel-file/node')
const fs = require("fs");
const { count } = require('console');


const pathExcel = `/home/vian/Documents/exceltrial/excel/DataExcel.xlsx`;
const pathTxt = '/home/vian/daftarJig3Oct.txt';

// // File path.
let katashiki=[];
let baris=[];
let dataExcel={};
let katashikiConv=[];
let typeKatashiki;
let groupKatashiki=[];
let indexGroup=0;
let katashikiJsonPrev={model:0,warna:0,type:0};
let counterKatashiki=[0];

let katashikiFromLog;
let flattenKatashikiFromLog;
let groupKatashikiLog=[];
let indexGroupLog=0;
let counterKatashikiLog;
let katashikiFromLogPrev={model:0,warna:0,type:0};
let similiarity=0;


const model={
  'D40L'  :1,
  'D40D'  :4,
	'JUMP'  :1,
  'SWING' :1,
  'CUT'   :1,	
  'D17'  :5,	
  'D26'   :6,	
  'T26'   :7,
  'LOW'   :8,
  'TOYOTA':9,
	'D12L'  :2,
  'AERO'  :2,
	'HIGHT' :3
  // 'RR':40

}

const modelLog={
  1 :'D40L'  ,
  4 :'D40D'  ,
  5 :'D17D'  ,
  6 :'D26'   ,
  7 :'T26'   ,
  8 :'D79-LOW'   ,
  9 :'T79',
  2 :'D12L'  ,
  3 :'D79-HIGHT',
  40 : 'D79-RR-RR' 
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

const warnaLog={
  1  :'1G3',
  2  :'T23',
  4  :'1E7',
  6  :'X12',
  7  :'3Q3',
  9  :'W09',
  11 :'R71',
  12 :'4T3',
  14 :'X13',
  16 :'X09',
  19 :'S28',
  20 :'P20',
  21 :'G64',
  17 :'R75'
}


// convert katashiki to JSON model, warna, dan type
function convert(item){
  if(!item){
    return item // handle null
  } 

  const data = `${item}`.split(/[ -]+/); // split data katashiki name 
  
  if(!model[data[0]]){
    if(data[0]==='RR'){
      return {"model":40,"color":warna[data[3]],"type":3}
    }
    if(data[0]==='26')return {
      "model":6,"color":warna[data[1]],"type":3
    }
    return item
  }

  if(!warna[data[1]]){  //jika warna gabung dengan tipe ex: 4T3FR-FR
    data[1] = data[1].substr(0,3);
  } 
  
  data[2]==='FR'?typeKatashiki=2:typeKatashiki=1;  //jika ada tambahan FR-FR type jd FR-FR
    
  return {"model":model[data[0]],"color":warna[data[1]]}
  }


function readall (stream)
{
  return new Promise ((resolve, reject) => {
    const chunks = [];
    stream.on ('error', (error) => reject (error));
    stream.on ('data',  (chunk) => chunk && chunks.push (chunk));
    stream.on ('end',   ()      => resolve (Buffer.concat (chunks)));
  });
}


  function readfile (filename)
  {
    return readall (fs.createReadStream (filename));
  }

  async function readExcelFile()
  {
  await readXlsxFile(fs.createReadStream(pathExcel)).then((rows) => {
    // `rows` is an array of rows
    // each row being an array of cells.
    for (let index = 0; index < 7; index++) {
      katashiki.push(rows[index+7]);
    }
  
    for (let indexBaris = 0; indexBaris < 7; indexBaris++) {
      
      for (let i = 1; i < 65; i++) {
        if(katashiki[indexBaris][i]!=null){
          katashiki[indexBaris][i].trim();
          katashikiConv.push(katashiki[indexBaris][i]);
        }
      }
    }
    katashikiConv.filter(Number); //remove null element 
    
    for (let indexKatashiki = 0; indexKatashiki < katashikiConv.length; indexKatashiki++) {
      const katashikiJson = convert(katashikiConv[indexKatashiki]);
      

      if(!katashikiJson.model)katashikiJson.model=0
      counterKatashiki[`${katashikiConv[indexKatashiki]}`]>0?counterKatashiki[`${katashikiConv[indexKatashiki]}`]++:counterKatashiki[`${katashikiConv[indexKatashiki]}`]=1;
      // console.log(katashikiJson);
        groupKatashiki[`${modelLog[katashikiJson.model]}-${warnaLog[katashikiJson.color]}`] = {...katashikiJson,jumlah:counterKatashiki[`${katashikiConv[indexKatashiki]}`]};
      // katashikiJsonPrev = katashikiJson;
    }
  })
  console.log(groupKatashiki);
  return groupKatashiki;   
  }




(async()=>{
  let pattern  = await readExcelFile();
  
})();
