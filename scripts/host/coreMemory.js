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
    //Initiliaze array with 0's
    var i = 0;
    while (i <= 64) {
        this.Memory[i] = "00";
        i++;
    }
    i = 0;
    while (i <= 64) {
        i++;
    }
    this.display();
}

function setMemory(args, base) {
    base = parseInt(base, 16);
    var program = args;
    //for each opcode add them to the correct position
    for (x in program) {
        var newBase = parseInt(x) + base; 
        this.Memory[newBase] = program[x];
       
    }
    _currentPCB.startLocation = base;
}

function memoryDisplay() {
    var display = document.getElementById("MemoryDisplay");
    display.innerHTML = "";
    var i = 0;
    var row = "0000: ";
    var rowEnds = 0;
    while (i <= 64) {
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