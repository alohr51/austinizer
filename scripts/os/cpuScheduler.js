/**
 * 
 */

function CpuScheduler() {
    this.quantum = _Quantum;
    this.schedule = _RoundRobin;
    this.getFromDisk = getProgramFromDisk;
    this.contextSwitch = function () {
    	var savePCB = new pcb();
    	//if the process is not finished put it back on the readyQueue
    	//then pull the next process off.
    	_currentPCB.location = "ready queue";
    	_currentPCB.updatePcCell(_currentPCB.pid,_currentPCB.location);
    	savePCB= _currentPCB;
    	_currentPCB = readyQueue.shift();
    	
    	//swap from disk
    	if(_currentPCB.disk===true){
    		//save program from mem to disk
	   		 _fileSystemDeviceDriver.create(savePCB.pid);
			 _fileSystemDeviceDriver.write(savePCB.pid,_coreMem.Memory.slice(savePCB.startLocation,savePCB.endLocation));
			 savePCB.disk = true;
			 savePCB.location = "disk";
			 _currentPCB.updatePcCell(savePCB.pid,savePCB.location);
			 //load the program from disk to memory
    		_coreMem.set(getProgramFromDisk(),parseInt(_3rdMemoryStart));
    		_currentPCB.startLocation = parseInt(_3rdMemoryStart);
    		_currentPCB.endLocation = savePCB.endLocation;
    		//_currentPCB.program_counter = 0;
    		_currentPCB.disk = false;
    		
    	}
    	
    	_currentPCB.location = "running";
    	_currentPCB.updatePcCell(_currentPCB.pid,_currentPCB.location);
    	if(!savePCB.finished){
    		readyQueue.push(savePCB);
    	}
    	
    	//updates the real time PCB table if the process is not in it already
    	if(!_currentPCB.inTable(_currentPCB.pid)){
        	_currentPCB.addRow();
    	}
    	
    	
    };
    
    function getProgramFromDisk(){
    	//check disk
    	var files = _fileSystemDeviceDriver.list();
    	for(var fileKey in files){
    		var filename =_FileSystem[fileKey].data.replace(/-/g, '');
    			//skip the mbr
    			if(filename!="MBR"){
    				var progInput = (_fileSystemDeviceDriver.read(filename));
    				return progInput;
    			}
    		}
    }
}