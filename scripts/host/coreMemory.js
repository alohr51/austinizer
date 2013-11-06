//coreMemory.js

function coreMemory() {
    // setup
    this.Memory = new Array();
    
    // Core Memory Methods
    this.init = memoryInit;
    this.display = memoryDisplay;
    this.set = setMemory;
}

function memoryInit() {
    //Initialize array with 0's
    var i = 0;
    while (i <= 782) {
        this.Memory[i] = "00";
        i++;
    }
    i = 0;
    while (i <= 782) {
        i++;
    }
    this.display();
}

function setMemory(args, base) {
    base = parseInt(base);
    var program = args;
    //for each opcode add them to the correct position
    if(program.length < _PartitionSize){
    	_MemGood = true;
    	for (x in program) {
    		var newBase = parseInt(x) + base; 
    		this.Memory[newBase] = program[x];
       
    	}
    	}
    else{
    	krnTrace("ERROR: Current program is too large. You only have: "+ _PartitionSize+" bytes of memory to use." +
    			"The program you are trying to load is: "+ program.length+ " bytes");
    }
    //_currentPCB.startLocation = base;
}

function memoryDisplay() {
    var display = document.getElementById("MemoryDisplay");
    display.innerHTML = "";
    var i = 0;
    var row = "0000: ";
    var rowEnds = 0;
    while (i <= 782) {
        //checks if at end of line
        if (rowEnds == 8) {
        	display.innerHTML = display.innerHTML + "<div>" + row + "</div>";
            var getrow = i;
            //filler from utils
            row = displayfiller(getrow.toString(), "0000") + ": ";
            rowEnds = 0;
        }
        row = row + displayfiller(this.Memory[i].toString(), "00") + " ";
        rowEnds++;
        i++;
    }
}