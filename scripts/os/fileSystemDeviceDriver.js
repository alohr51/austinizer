/**
 * 
 */
function fileSystemDeviceDriver() {
    // Override the base method pointers.
//    this.driverEntry = krnFileSystemDriverEntry;
//    this.isr = null;
    this.format = fsFormat;
    this.init = fsInit;
    this.test = getStorageIndex;
    this.create = createFile;
    this.write = writeToFile;
    this.read = readFile;
    this.deleteFile = deleteFile;

}
//object used to keep track of files and data
function fsField(occupied,track,sector,block,data)
{
this.occupied=occupied,
this.track=track,
this.sector=sector,
this.block=block,
this.data = data;
}
//a toString for fsField
fsField.prototype.toString = function fsFieldToString() {
	  var fsString = + this.occupied + "," + this.track + "," + this.sector + "," + this.block+","+this.data;
	  return fsString;
	};
	
function fsInit() {
	document.getElementById("fileDisplay").innerHTML = "Corrupt- Please Format";
	//create MBR
	var mbrKey = JSON.stringify("000");
	mbrObj= new fsField(1,-1,-1,-1,"MBR");
	storeMBR = JSON.stringify(mbrObj);
	localStorage[mbrKey] = storeMBR;
	_FileSystem[0]= new fsField(1,-1,-1,-1,"MBR");
    //Initialize array with -'s
    var i = 1;
    while (i <= _NumOfFileSystemRows) {
    	var fsF = new fsField(0,'-','-','-',"");
        _FileSystem[i] = fsF;
        i++;
    }
    //update display from storage if there are any that persisted
    for (var t = 0; t < 4; t++) {
        for (var s = 0; s < 8; s++) {
		    for (var b = 0; b < 8; b++) {
			    var normalKey=(t.toString()+s.toString()+b.toString());
			    var JsonKey = JSON.stringify(normalKey);
			    if(localStorage.getItem(JsonKey)!=null){
			    	var fsFileObj=(localStorage.getItem(JsonKey));
			    	var obj = JSON.parse(fsFileObj);
			    	var replaceFsFile = new fsField(obj.occupied,obj.track,obj.sector,obj.block,obj.data);
			    	_FileSystem[getKeyIndex(normalKey)]=replaceFsFile;
			    }//end if
		    }//end b loop
        }//end s loop
    }// end t loop
}//end function

function fsFormat() {
	_isFormatted = true;
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
                	row = row + displayfiller(_FileSystem[arrayIter].toString(), "00") + " ";
                	
                	arrayIter++;
                	}

                }//end b loop
            }//end s loop
        }//end t loop
}//end function

function updateFileSystemDisplay(){
    var display = document.getElementById("fileDisplay");
    display.innerHTML = "";
    var arrayIter=0;
    var row="";
        for (var t = 0; t < 4; t++) {
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                	display.innerHTML = display.innerHTML + "<div>" + row + "</div>";
                	var getrow = "["+t+","+s+","+b;
                	//filler from utils
                	row = displayfiller(getrow.toString(), "000") + "]: ";
                	if(arrayIter<=_NumOfFileSystemRows){
                	row = row + displayfiller(_FileSystem[arrayIter].toString(), "00") + " ";
                	arrayIter++;
                	}
                }//end b loop
            }//end s loop
        }//end t loop
}//end function

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
	//fileKeyIndex will tell us the index in the FileSystem array to update for user display
	var fileKeyIndex = getKeyIndex(JSON.parse(fileKey));
	var dataKey = JSON.parse(getNextDataKey());
	//set T S B for the fsFile object
	var track=dataKey.substring(0,1);
	var sector = dataKey.substring(1,2);
	var block = dataKey.substring(2,3);
	var createObj = new fsField(1,track, sector,block,topOff(filename));
	//alert("fileKey: "+fileKey + "dataKey: "+dataKey+"  t:"+track+"  s:"+sector+"  b: "+block);
	localStorage.setItem(fileKey,JSON.stringify(createObj));
	if(localStorage[fileKey]!=null){
		//update the display
		_FileSystem[fileKeyIndex]=createObj;
		updateFileSystemDisplay();
		return true;
	}
	else{
		return false;
	}
}

function writeToFile(filename,data){
	var track=-1;
	var sector = -1;
	var block = -1;
	for(var i = 1; i < _FileSystem.length;i++){
		if(_FileSystem[i].data.length>=1){
			//get only the file without filler
			var fname = _FileSystem[i].data.replace(/-/g, '');
			if(fname===filename){
				track = _FileSystem[i].track;
				sector= _FileSystem[i].sector;
				block = _FileSystem[i].block;
			}
			
		}
	}
	var objWrite = new fsField(1,track,sector,block,data);
	if(objWrite.track===-1&&objWrite.sector===-1){
		krnTrace("File Not Found");
		return false;
	}
	else{
	var combinedKey = track.toString()+sector.toString()+block.toString();
	var arrayKey = getKeyIndex(combinedKey);
	var storeKey = JSON.stringify(combinedKey);
	_FileSystem[arrayKey] = objWrite;
	var JsonWriteObj = JSON.stringify(objWrite);
	localStorage.setItem(storeKey,JsonWriteObj);
	updateFileSystemDisplay();
	return true;
	}	
}
//Read
function readFile(filename){
	var track=-1;
	var sector = -1;
	var block = -1;
	var data = "";
	for(var i = 1; i < _FileSystem.length;i++){
		if(_FileSystem[i].data.length>=1){
			//get only the file without filler
			var fname = _FileSystem[i].data.replace(/-/g, '');
			if(fname===filename){
				track = _FileSystem[i].track;
				sector= _FileSystem[i].sector;
				block = _FileSystem[i].block;
				data = _FileSystem[i].data;
			}
		}
	}
	var objRead = new fsField(1,track,sector,block,data);
	//make sure we actually found the file
	if(objRead.track===-1 && objRead.sector===-1){
		return "File Not Found";
	}
	else{
		//get the T S B of where the data is located
		var combinedKey = track.toString()+sector.toString()+block.toString();
		//prepare the key for localStorage
		var storeKey = JSON.stringify(combinedKey);
		var readme = JSON.parse(localStorage.getItem(storeKey,objRead));
		updateFileSystemDisplay();
		if(readme.data===""){
			return " No Data in file";
		}
		else{
			return readme.data;
		}
	}
}

function deleteFile(filename){
	var currentPosition = -1;
	var track=-1;
	var sector = -1;
	var block = -1;
	var data = "";
	for(var i = 1; i < _FileSystem.length;i++){
		if(_FileSystem[i].data.length>=1){
			//get only the file without filler
			var fname = _FileSystem[i].data.replace(/-/g, '');
			if(fname===filename){
				currentPosition = i;
				track = _FileSystem[i].track;
				sector= _FileSystem[i].sector;
				block = _FileSystem[i].block;
				data = _FileSystem[i].data;
			}
		}
	}
	var objRead = new fsField(1,track,sector,block,data);
	//make sure we actually found the file
	if(objRead.track===-1 && objRead.sector===-1){
		return false;
	}
	else{
		var combinedKey = track.toString()+sector.toString()+block.toString();
		var arrayKey = getKeyIndex(combinedKey);
		//delete the file data in the array
		 _FileSystem[arrayKey] = new fsField(0,-1,-1,-1,"");
		 //delete the file directory
		 _FileSystem[currentPosition] = new fsField(0,'-','-','-',"");
		 var storeFileKey = getStorageIndex(currentPosition);
		 var storeDataKey = getStorageIndex(arrayKey);
		 alert("filekey: " + storeFileKey + "storedatakey: "+storeDataKey);
		 //remove the directory and its data
		 localStorage.removeItem(storeFileKey);
		 localStorage.removeItem(storeDataKey);
		 updateFileSystemDisplay();
		 return true;
	}
}

function topOff(data) {
    var length = data.length;
    //top off the 60 bit data string
    for (var i = length; i < 60; i++) {
        data += "-";
    }
    return data;
}
//helps us convert the internal storage keys to the 
//display keys array that is used for user display
function getKeyIndex(storageKey){
	var index = 0;
    for (var t = 0; t < 4; t++) {
        for (var s = 0; s < 8; s++) {
            for (var b = 0; b < 8; b++) {
            	var getrow = t.toString()+s.toString()+b.toString();
            	if(storageKey===getrow){
            		return index;
            	}
            	else{
            		index++;
            	}
            }
        }
    }
}
//find the storage key given the array key
function getStorageIndex(keyIndex){
	var index = 0;
	outerloop:
    for (var t = 0; t < 4; t++) {
        for (var s = 0; s < 8; s++) {
            for (var b = 0; b < 8; b++) {
            	if(index===keyIndex){
            		return( JSON.stringify(t.toString()+s.toString()+b.toString()));
            		break outerloop;
            	}
            	else{
            		index++;
            	}
            }
        }
    }
}






