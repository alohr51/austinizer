/**
 * 
 */

function CpuScheduler() {
    this.quantum = _Quantum;
    this.schedule = _RoundRobin;
    this.contextSwitch = function () {
    	var savePCB = new pcb();
    	//if the process is not finished put it back on the readyQueue
    	//then pull the next process off.
    	savePCB= _currentPCB;
    	_currentPCB = readyQueue.shift();
    	if(!savePCB.finished){
    		readyQueue.push(savePCB);
    	}
    	
    	//updates the real time PCB table if the process is not in it already
    	if(!_currentPCB.inTable(_currentPCB.pid)){
        	_currentPCB.addRow();
    	}
    	
    	
    };
}