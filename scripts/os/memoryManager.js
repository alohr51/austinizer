//Memory Manager

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

//Store a program at desired memory block
function StoreProgram(args) {
	if(_ProgramsStored===0){
		_coreMem.set(args, _MemoryStart);
	}
	else if(_ProgramsStored===1){
		_coreMem.set(args, _2ndMemoryStart);
	}
	else if(_ProgramsStored===2){
		_coreMem.set(args, _3rdMemoryStart);
	}
	_ProgramsStored++;
}


function getPC() {
    var pc = _currentPCB.startLocation + _currentPCB.program_counter;
    return pc;
}