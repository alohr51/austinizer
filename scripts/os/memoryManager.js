//Memory Manager

function memoryManager() {
	krnTrace("Memory Manager");
    this.storeProgram = StoreProgram;
    this.getInstruction = getInstruction;
    this.getPC = getPC;
    this.findStart = findStart;
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
		_ProgramsStored++;
	}
	else if(_ProgramsStored===1){
		_coreMem.set(args, _2ndMemoryStart);
		_ProgramsStored++;
	}
	else if(_ProgramsStored===2){
		_coreMem.set(args, _3rdMemoryStart);
		_ProgramsStored++;
	}
	//put it on disk
	else if(_ProgramsStored===3){
		var filename = "prog"+_ProgramsStored;
		 _fileSystemDeviceDriver.create(filename);
		 _fileSystemDeviceDriver.write(filename,args);
	}
	else if(_ProgramsStored > 3){
		_MemGood = false;
		krnTrace("ERROR: all 3 memory partitions are full!");
	}
	
}

function findStart() {
	if(_ProgramsStored===0){
		return _MemoryStart;
	}
	else if(_ProgramsStored===1){
		return _2ndMemoryStart;
	}
	else if(_ProgramsStored===2){
		return _3rdMemoryStart;
	}
	else if(_ProgramsStored ===3){
		return _3rdMemoryStart;
	}
}




function getPC() {
    var pc = parseInt(_currentPCB.startLocation) + parseInt(_currentPCB.program_counter);
    return pc;
}