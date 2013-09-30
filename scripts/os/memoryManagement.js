/**
 * Memory Management
 */

function memoryManagement() {
	krnTrace("Memory Management");
    this.storeProgram = StoreProgram;
    this.getAddress = getMemoryAddress;
    this.getPC = getPC;
}

//keep track of PID for programs
function getPid(){
	return _Pid++;
}


function getMemoryAddress(args) {
    var pc_index = args;
    return (_mainMem.Memory[pc_index]);
}

//Store a program at 0000
function StoreProgram(args) {
    _mainMem.set(args, "0000");
}


function getPC() {
    var pc = _currentPCB.base_location + _currentPCB.program_counter;
    return pc;
}