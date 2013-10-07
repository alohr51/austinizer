//Memory Management

function memoryManager() {
	krnTrace("Memory Manager");
    this.storeProgram = StoreProgram;
    this.getInstruction = getInstruction;
    this.getPC = getPC;
}

//keep track of PID for programs
function getPid(){
	return _Pid++;
}


function getInstruction(args) {
    var pc_index = args;
    return (_coreMem.Memory[pc_index]);
}

//Store a program at 0000
function StoreProgram(args) {
    _coreMem.set(args, "0000");
}


function getPC() {
    var pc = _currentPCB.startLocation + _currentPCB.program_counter;
    return pc;
}