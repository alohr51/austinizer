/**
 * 
 */
function fileSystemDeviceDriver() {
    // Override the base method pointers.
//    this.driverEntry = krnFileSystemDriverEntry;
//    this.isr = null;
    this.FileSystem = new Array();
    this.format = fsFormat;
    this.init = fsInit;
    //this.test = create;
    this.create = createFile;
//    // Main functionality
//    this.format = krnFormat;
//    this.create = krnCreate;
//    this.write = krnWrite;
//    this.read = krnRead;
//    //this.delete = krnDelete;
//    this.listFiles = krnlistFiles;
//    // Helper functions
//    this.findOpenDirectoryBlock = krnFindOpenDirectoryBlock;
//    this.findOpenFileBlock = krnFindOpenFileBlock;
//    this.setValueOccupied = krnSetValueOccupied;
//    this.getMatchingDirectory = krnGetMatchingDirectory;
//    this.getAllLinkedFileBlocks = krnGetAllLinkedFileBlocks;
//    this.formatLineWithKey = krnFormatLineWithKey;
//    this.getOccupiedDirectories = krnGetOccupiedDirectories;
//    this.fillEmptySpace = krnFillEmptySpace;
//    this.parseKey = parseKey;
}
function fsField(occupied,track,sector,block,data)
{
this.occupied=occupied,
this.track=track,
this.sector=sector,
this.block=block,
this.data = data;
}

fsField.prototype.toString = function fsFieldToString() {
	  var ret = + this.occupied + "," + this.track + "," + this.sector + "," + this.block+","+this.data;
	  return ret;
	};
	
function fsInit() {
	document.getElementById("fileDisplay").innerHTML = "Corrupt- Please Format";
	//create MBR
	var mbrKey = JSON.stringify("000");
	localStorage[mbrKey] = new fsField(1,-1,-1,-1,"MBR");
    //Initialize array with -'s
    var i = 0;
    while (i <= _NumOfFileSystemRows) {
    	var fsF = new fsField(0,'-','-','-',"");
        this.FileSystem[i] = fsF;
        i++;
    }
    
}

function fsFormat() {
    var display = document.getElementById("fileDisplay");
    display.innerHTML = "";
    var arrayIter=0;
    var row="";
        for (var t = 0; t < 4; t++) {
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                	var key = JSON.stringify(t+""+s+""+b);
                	_KeyArray.push(key);
                	_DataKeyArray.push(key);
                	display.innerHTML = display.innerHTML + "<div>" + row + "</div>";
                	var getrow = "["+t+","+s+","+b;
                	//alert(getrow);
                	//filler from utils
                	row = displayfiller(getrow.toString(), "000") + "]: ";
                	if(arrayIter<=_NumOfFileSystemRows){
                	row = row + displayfiller(this.FileSystem[arrayIter].toString(), "00") + " ";
                	arrayIter++;
                	}

                }//end b loop
            }//end s loop
        }//end t loop
}

function getNextFileKey() {
	for(var i = 0;i<_KeyArray.length;i++){
		var key =  _KeyArray.shift();
		if(localStorage.getItem(key)===null){
			return key;
			break;
		}
}
}

function getNextDataKey() {
	for(var i = 0;i<_DataKeyArray.length;i++){
		var key =  _DataKeyArray.shift();
		var keyParse = JSON.parse(key);
		//make sure we are in correct track using substring
		if(localStorage.getItem(key)===null&&keyParse.substring(0,1)!=0){
			return key;
			break;
		}
}
}

function createFile(fileName){
	var fileKey = getNextFileKey();
	var dataKey = JSON.parse(getNextDataKey());
	alert(dataKey);
	var track=dataKey.substring(0,1);
	var sector = dataKey.substring(1,2);
	var block = dataKey.substring(2,3);
	var createObj = new fsField(1,track, sector,block,filename);
	//alert("fileKey: "+fileKey + "dataKey: "+dataKey+"  t:"+track+"  s:"+sector+"  b: "+block);
	localStorage.setItem(fileKey,JSON.stringify(createObj));
	if(localStorage[fileKey]!=null){
		return true;
	}
	else{
		return false;
	}
	}

function getNextBlock() {
    var keyIntValue = 0;
    var valueArray;
    var occupiedBit;
    for (key in localStorage) {
        keyIntValue = parseKey(key);
        //100 to 300 is the file space
        if (keyIntValue >= _FileSpaceStart && keyIntValue <= _FileSpaceEnd) {
            valueArray = JSON.parse(localStorage[key]);
            occupiedBit = valueArray[0];
            if (occupiedBit === 0) {
                // Return the TSB location of the open file block
                return (key);
            }
        }
    }
    //none are open
    return null;
}


function topOff(data) {
    var length = data.length;
    //top off the 60 bit data string
    for (var i = length; i < 60; i++) {
        data += "-";
    }
    return data;
}








