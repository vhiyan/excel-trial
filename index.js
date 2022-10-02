const readXlsxFile = require('read-excel-file/node')
const fs = require("fs");


const pathExcel = `29 SEPTEMBER 2022.xlsx`;
const pathTxt = '/home/vian/daftarJig30Sept.txt';

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
  'D17D'  :5,	
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
  1 :'JUMP'  ,
  1 :'SWING' ,
  1 :'CUT'   ,
  5 :'D17D'  ,
  6 :'D26'   ,
  7 :'T26'   ,
  8 :'LOW'   ,
  9 :'TOYOTA',
  2 :'D12L'  ,
  2 :'AERO'  ,
  3 :'HIGHT' 
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
        if(katashiki[indexBaris][i]!=null)katashikiConv.push(katashiki[indexBaris][i])
      }
    }
    katashikiConv.filter(Number); //remove null element 
    
    for (let indexKatashiki = 0; indexKatashiki < katashikiConv.length; indexKatashiki++) {
      const katashikiJson = convert(katashikiConv[indexKatashiki]);
  
  
      
      if(katashikiJson.model)
      {
        if(katashikiJson.model!=katashikiJsonPrev.model||katashikiJson.color!=katashikiJsonPrev.color){
          indexGroup++;
          counterKatashiki=0;
        }
      }
      counterKatashiki++;
      groupKatashiki[`${indexGroup}`] = {...katashikiJson,counter:counterKatashiki};
      katashikiJsonPrev = katashikiJson;
    }
  })
  // console.log(groupKatashiki);
  return groupKatashiki;   
  }

  async function readTxt(){
    let content = await readfile(pathTxt).catch ((e) => {})
    let baris = content.toString().split(`\n`);
    for (let indexLog = 0; indexLog < baris.length; indexLog++) {
      const tempKatashiki = baris[indexLog].split(`\t`);
      if(tempKatashiki[1])
      {
        katashikiFromLog = JSON.parse(tempKatashiki[1]);
        delete katashikiFromLog.counter;
        delete katashikiFromLog.type;
        
        if(katashikiFromLog.model!=katashikiFromLogPrev.model||katashikiFromLog.color!=katashikiFromLogPrev.color)
        {
          indexGroupLog++;
          counterKatashikiLog=0;  
        }
        
        if(counterKatashikiLog>6){counterKatashikiLog=0;indexGroupLog++;}
      
        counterKatashikiLog++;
        groupKatashikiLog[`${indexGroupLog}`] = {...katashikiFromLog,counter:counterKatashikiLog};
        katashikiFromLogPrev = katashikiFromLog;
      }
    }
    // console.log(groupKatashikiLog);
  return groupKatashikiLog;
  }



(async()=>{
  let pattern  = await readExcelFile();
  let plc = await readTxt();
  pattern = pattern.filter(Boolean);
  plc = plc.filter(Boolean);
  

  console.log(plc.length,pattern.length);
  
  for (let indexCheck = 0; indexCheck < pattern.length; indexCheck++) {
    if(!pattern[indexCheck])console.log(pattern[indexCheck]);
    if(!plc[indexCheck])console.log(plc[indexCheck]);
    
    if(pattern[indexCheck]&&plc[indexCheck])
    {
      console.log(plc[indexCheck],pattern[indexCheck]);
      let modelOK=false;
      let colorOK=false;
      let counterOK=false;

      pattern[indexCheck].model===plc[indexCheck].model?modelOK=true:console.log(`model ${plc[indexCheck].model}-${pattern[indexCheck].model}`);
      pattern[indexCheck].color===plc[indexCheck].color?colorOK=true:console.log(`warna ${plc[indexCheck].color}-${pattern[indexCheck].color}`);
      pattern[indexCheck].counter===plc[indexCheck].counter?counterOK=true:console.log(`counter ${plc[indexCheck].counter}-${pattern[indexCheck].counter}`);

      if(modelOK&&colorOK&&colorOK&&counterOK)similiarity++;
    }

  }
console.log('selisih = ',pattern.length-similiarity,"dari",pattern.length);
})();
