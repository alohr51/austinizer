/**
 * 
 */
function fileSystemDeviceDriver() {
    // Override the base method pointers.
//    this.driverEntry = krnFileSystemDriverEntry;
//    this.isr = null;
    this.FileSystem = new Array();
    this.display = fsDisplay;
    this.init = fsInit;
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
    //Initialize array with -'s
    var i = 0;
    while (i <= _NumOfFileSystemRows) {
    	var fsF = new fsField(-1,'-','-','-',"");
        this.FileSystem[i] = fsF;
        i++;
    }
    this.display();
}



function fsDisplay() {
    var display = document.getElementById("fileDisplay");
    display.innerHTML = "";
    var arrayIter=0;
    var row="";
        for (var t = 0; t < 4; t++) {
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                	display.innerHTML = display.innerHTML + "<div>" + row + "</div>";
                	var getrow = t+","+s+","+b;
                	//alert(getrow);
                	//filler from utils
                	row = displayfiller(getrow.toString(), "000") + ": ";
                	if(arrayIter<=_NumOfFileSystemRows){
                	row = row + displayfiller(this.FileSystem[arrayIter].toString(), "00") + " ";
                	arrayIter++;
                	}
                	
                	
                }
            }
            }
    
}


function krnFormat() {
    try {
        //clear to be safe
        localStorage.clear();
        var key = "";
        var value = "";
        for (var t = 0; t < 4; t++) {
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    //get keys(track is 0-3, sector and block are 0-7
                    key = getJSONKey(t, s, b);
                    //the default value
                    fsValue = getJSONValue(0, -1, -1, -1, "");
                    localStorage[key] = value;
                }//end b loop
            }//end s loop
        }//end t loop
        
        //init the master boot record
        localStorage[_MasterBootRecordKey] = fileSystemValue(1, -1, -1, -1, "MBR");
        return true;
    } catch (error) {
        return false;
    }
}

//key for file system
function getJSONKEY(track, sector, block) {
    return JSON.stringify([track, sector, block]);
}
// Basic value in the file system (constructor)
function getJSONValue(filled, track, sector, block, data) {
    return JSON.stringify([filled, track, sector, block, krnFillEmptySpace(data)]);
}


function getNextKey() {
    var keyIntValue = 0;
    var valueArray;
    var occupiedBit;
    for (key in localStorage) {
        keyIntValue = parseKey(key);
        // Ensure we are iterating through directory space only
        if (keyIntValue >= 0 && keyIntValue <= 77) {
            valueArray = JSON.parse(localStorage[key]);
            occupiedBit = valueArray[0];
            if (occupiedBit === 0) {
                // Return the TSB location of the open directory block
                return (key);
            }
        }
    }
    // If no directory blocks are open return null
    return null;
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











