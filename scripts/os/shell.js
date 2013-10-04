/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.


function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.func = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.func = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down os, but leaves HW sim running";
    sc.func = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.func = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.func = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.func = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.func = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.func = shellPrompt;
    this.commandList[this.commandList.length] = sc;
    
    //status <string>
    sc = new ShellCommand();
    sc.command ="status";
    sc.description = "<string> - Sets the status bar.";
    sc.func = function(args){
        if (args.length > 0)
        {
        	document.getElementById("userStatus").innerHTML = args;
        }
        else
        {
            _StdIn.putText("Usage: prompt <string>  Please supply a string.");
        }
    
    };
    this.commandList[this.commandList.length]=sc;
    
    //BSOD
    sc = new ShellCommand();
    sc.command ="bsod";
    sc.description = "- Opens the gates of hell.";
    sc.func = function(args){
    	krnTrapError("BSOD Test");
    };
    this.commandList[this.commandList.length]=sc;
    
    //state info
    sc = new ShellCommand();
    sc.command ="stateinfo";
    sc.description = "<string> -Shows US state info. Ex. stateInfo nj";
    sc.func = stateList;
    this.commandList[this.commandList.length]=sc;
    
    //austinizer command. 
    sc = new ShellCommand();
    sc.command ="austin";
    sc.description = "-Austin Powers. Danger is my middle name.";
    sc.func = function(){
    	if(_Austin){
    		_StdIn.putText("Who turns off Austin? Honestly! Bye!");
    		_Austin = false;
    	}
    	else{
    	//play audio clip
    	document.getElementById("swinger").play();
    	_StdIn.putText("I put the GRR in swingger baby! Austin Time!");
    	_Austin = true;
    	}
    };
    this.commandList[this.commandList.length]=sc;
    
    //load
    sc = new ShellCommand();
    sc.command ="load";
    sc.description = "- Loads in the user program input.";
    sc.func = function(){
    	var input = document.getElementById("taProgramInput").value;
    	var inputArray= input.split(" ");
    	for (var i=0;i<inputArray.length;i++)
    	{ 
    		var re = /^[a-f0-9]+$/i;
    		var str = inputArray[i];
    		var check = re.test(str);
    	}
    	if(check){
    		var pid = getPid();
    		//put program into ready queue with a pid
    		readyQueue[pid] = new pcb();
    		_currentPCB = readyQueue[pid];
    		//store in core memory
    		_memoryManagement.storeProgram(inputArray);
    		_coreMem.display();
    		if(_Austin){
    			_StdIn.putText("Yeah baby yeah! Program locked and loaded with PID: "+pid);
    		}
    		else{
    			_StdIn.putText("Program loaded with PID: "+pid);
    		}
    	}
    	else{
    		if(_Austin){
    			_StdIn.putText("This sort of Hex isn't my bag baby! Try only hex values!");
    		}
    		else{
    		_StdIn.putText("Error: Check Hex input. Only Hex values are allowed.");
    		}
    	}
    };
    this.commandList[this.commandList.length]=sc;
    
    //run
    sc = new ShellCommand();
    sc.command ="run";
    sc.description = " <int>- Runs the program with a PID";
    sc.func = function(args){
    	if(args == ''){
    		if(_Austin){
    			StdIn.putText("Ouch Kabibbles! Try entering a PID parameter!");
    		}
    		else{
    			StdIn.putText("please enter a PID");
    		}
    	}
    	else{
    		_currentPCB = readyQueue[args];
    		_CPU.cycle();
    		//add the process control block to the queue with
    		//associated PID
    		readyQueue[_PID] = _currentPCB;
    	}
    };
    this.commandList[this.commandList.length]=sc;
    
    //date
    sc = new ShellCommand();
    sc.command ="date";
    sc.description = " - Shows the current Date and Time.";
    sc.func = function(args){
    	var d = new Date();
    	_StdIn.putText(d.toLocaleString());
    };
    this.commandList[this.commandList.length]=sc;
    
    //whereami
    sc = new ShellCommand();
    sc.command="whereami";
    sc.description=" - shows your location on a google map.";
    sc.func = function(){
    	getLocation();
    	if(_Austin){
    		_StdIn.putText("Smashing! Look at me over there baby! yeah!");
    	}
    	else{
    	_StdIn.putText("Check the Map for your location.");
    }
    };
    
   this.commandList[this.commandList.length]=sc;
    
    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].func;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {

    this.execute(shellInvalidCommand);
        
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.func = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_Austin)
    {
        _StdIn.putText("OH Behave!!");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.putText("For what?");
   }
}

function shellVer(args)
{
	if(_Austin){
		_StdIn.putText("Allow myself to introduce...myself: "+APP_NAME + " version " + APP_VERSION);
	}
	else{
		_StdIn.putText(APP_NAME + " version " + APP_VERSION);    
}
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
	if(_Austin){
		_StdIn.putText("I will stop the shutdown for...1 MILLION DOLLARS!");
	}
	else{
		_StdIn.putText("Shutting down...");
     
	}
	krnShutdown();  
	// Call Kernel shutdown routine. 
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help":
            	if(_Austin){
            		_StdIn.putText("Help take down Dr. Evil with these vaild commands!");
            		break;
            	}
            	else{
            		_StdIn.putText("Help displays a list of (hopefully) valid commands.");
            		break;
            	}
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
        	//parameter on is entered
            case "on": 
                if (_Trace && _Austin)
                {
                    _StdIn.putText("I'm already turned on, oops I mean Trace. Yeah Baby Yeah!");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            //parameter off is entered    
            case "off": 
                _Trace = false;
                if(_Austin){
                	_StdIn.putText("Smashing Baby! Trace is turned off."); 
                	break;
                }
                else{
                	_StdIn.putText("Trace OFF");                
                	break;
                }
            default:
            	if(_Austin){
            		_StdIn.putText("OH right in the family jewels! Use ON | OFF");
            	}
            	else{
            		_StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
            	}
        }        
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
    	if(_Austin){
    		_StdIn.putText("Gah Blimey! Enter a string to rotate, groovy?");
    	}
    	else{
    		_StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

var doc=document.getElementById("display");
function getLocation()
{
    if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition,showError);
    }
}

function showPosition(position)
{
    var latlon=position.coords.latitude+","+position.coords.longitude;

    var img_url="http://maps.googleapis.com/maps/api/staticmap?center="
    +latlon+"&zoom=14&size=400x412&sensor=false";
    document.getElementById("location").innerHTML="<img src='"+img_url+"'>";
}

function showError(error)
{
    switch(error.code) 
    {
    case error.PERMISSION_DENIED:
      doc.innerHTML="Request for Geolocation denied by the user.";
      break;
    case error.POSITION_UNAVAILABLE:
      doc.innerHTML="Unavailable location information.";
      break;
    case error.TIMEOUT:
      doc.innerHTML="Location request timed out.";
      break;
    case error.UNKNOWN_ERROR:
      doc.innerHTML="UNKNOWN_ERROR.";
      break;
    }   
}
function stateList(args){

	var state = new Array(50);
	var initial = new Array(50);
	var capital = new Array(50);
	var date = new Array(50);
	var flower = new Array(50);
	var bird = new Array(50);
	
	initial[0] = "al";
	state[0] = "Alabama";
	capital[0] = "Montgomery";
	date[0] = "December 14, 1819";
	flower[0] = "Camellia";
	bird[0] = "Yellowhammer";
	
	initial[1] = "ak";
	state[1] = "Alaska";
	capital[1] = "Juneau";
	date[1] = "January 3, 1959";
	flower[1] = "Forget-me-not";
	bird[1] = "Willow Ptarmigan";
	
	initial[2] = "az";
	state[2] = "Arizona";
	capital[2] = "Phoenix";
	date[2] = "February 14, 1912";
	flower[2] = "Suguaro Cactus Blossom";
	bird[2] = "Cactus Wren";
	
	initial[3] = "ar";
	state[3] = "Arkansas";
	capital[3] = "Little Rock";
	date[3] = "June 15, 1836";
	flower[3] = "Apple Blossom";
	bird[3] = "Mockingbird";
	
	initial[4] = "ca";
	state[4] = "California";
	capital[4] = "Sacremento";
	date[4] = "September 9, 1850";
	flower[4] = "Golden Poppy";
	bird[4] = "California Valley Quail";
	
	initial[5] = "co";
	state[5] = "Colorado";
	capital[5] = "Denver";
	date[5] = "August 1, 1876";
	flower[5] = "Mountain Columbine";
	bird[5] = "Lark Bunting";
	
	initial[6] = "ct";
	state[6] = "Connecticut";
	capital[6] = "Hartford";
	date[6] = "January 9, 1788";
	flower[6] = "Mountain Laurel";
	bird[6] = "Robin";
	
	initial[7] = "fl";
	state[7] = "Florida";
	capital[7] = "Tallahassee";
	date[7] = "March 3, 1845";
	flower[7] = "Orange Blossom";
	bird[7] = "Mockingbird";
	
	initial[8] = "ga";
	state[8] = "Georgia";
	capital[8] = "Atlanta";
	date[8] = "January 2, 1788";
	flower[8] = "Cherokee Rose";
	bird[8] = "Brown Thrasher";
	
	initial[9] = "hi";
	state[9] = "Hawaii";
	capital[9] = "Honolulu";
	date[9] = "August 21, 1959";
	flower[9] = "Red Hibiscus";
	bird[9] = "Nene (Hawaiian Goose)";
	
	initial[10] = "id";
	state[10] = "Idaho";
	capital[10] = "Boise";
	date[10] = "July 3, 1890";
	flower[10] = "Syringa";
	bird[10] = "Mountain Bluebird";
	
	initial[11] = "il";
	state[11] = "Illinois";
	capital[11] = "Springfield";
	date[11] = "December 3, 1818";
	flower[11] = "Violet";
	bird[11] = "Cardinal";
	
	initial[12] = "in";
	state[12] = "Indiana";
	capital[12] = "Indianapolis";
	date[12] = "December 11, 1816";
	flower[12] = "Peony";
	bird[12] = "Cardinal";
	
	initial[13] = "ia";
	state[13] = "Iowa";
	capital[13] = "Des Moines";
	date[13] = "December 28, 1846";
	flower[13] = "Wild Rose";
	bird[13] = "Eastern Goldfinch";
	
	initial[14] = "ks";
	state[14] = "Kansas";
	capital[14] = "Topeka";
	date[14] = "January 29, 1861";
	flower[14] = "Sunflower";
	bird[14] = "Western Meadowlark";
	
	initial[15] = "ky";
	state[15] = "Kentucky";
	capital[15] = "Frankfort";
	date[15] = "June 1, 1792";
	flower[15] = "Goldenrod";
	bird[15] = "Cardinal";
	
	initial[16] = "la";
	state[16] = "Louisiana";
	capital[16] = "Baton Rouge";
	date[16] = "April 30, 1812";
	flower[16] = "Magnolia";
	bird[16] = "Eastern Brown Pelican";
	
	initial[17] = "me";
	state[17] = "Maine";
	capital[17] = "Augusta";
	date[17] = "March 15, 1820";
	flower[17] = "Pine Cone & Tassel";
	bird[17] = "Chickadee";
	
	initial[18] = "tn";
	state[18] = "Tennessee";
	capital[18] = "Nashville";
	date[18] = "June 1, 1796";
	flower[18] = "Iris";
	bird[18] = "Mockingbird";
	
	initial[19] = "md";
	state[19] = "Maryland";
	capital[19] = "Annapolis";
	date[19] = "April 28, 1788";
	flower[19] = "Black-eyed Susan";
	bird[19] = "Baltimore Oriole";
	
	initial[20] = "de";
	state[20] = "Delaware";
	capital[20] = "Dover";
	date[20] = "December 7, 1787";
	flower[20] = "Peach Blossom";
	bird[20] = "Blue Hen Chicken";
	
	initial[21] = "ma";
	state[21] = "Massachusetts";
	capital[21] = "Boston";
	date[21] = "February 6, 1788";
	flower[21] = "Mayflower";
	bird[21] = "Chickadee";
	
	initial[22] = "ri";
	state[22] = "Rhode Island";
	capital[22] = "Providence";
	date[22] = "May 29, 1790";
	flower[22] = "Violet";
	bird[22] = "Rhode Island Red";
	
	initial[23] = "mn";
	state[23] = "Minnesota";
	capital[23] = "St. Paul";
	date[23] = "May 11, 1858";
	flower[23] = "Lady-slipper";
	bird[23] = "Loon";
	
	initial[24] = "ms";
	state[24] = "Mississippi";
	capital[24] = "Jackson";
	date[24] = "December 10, 1817";
	flower[24] = "Magnolia";
	bird[24] = "Mockingbird";
	
	initial[25] = "mo";
	state[25] = "Missouri";
	capital[25] = "Jefferson City";
	date[25] = "August 10, 1821";
	flower[25] = "Hawthorn";
	bird[25] = "Bluebird";
	
	initial[26] = "mi";
	state[26] = "Michigan";
	capital[26] = "Lansing";
	date[26] = "January 26, 1837";
	flower[26] = "Apple Blossom";
	bird[26] = "Robin";
	
	initial[27] = "mt";
	state[27] = "Montana";
	capital[27] = "Helena";
	date[27] = "November 8, 1889";
	flower[27] = "Bitterroot";
	bird[27] = "Western Meadowlark";
	
	initial[28] = "ne";
	state[28] = "Nebraska";
	capital[28] = "Lincoln";
	date[28] = "March 1, 1867";
	flower[28] = "Goldenrod";
	bird[28] = "Western Meadowlark";
	
	initial[29] = "nv";
	state[29] = "Nevada";
	capital[29] = "Carson City";
	date[29] = "October 31, 1864";
	flower[29] = "Sagebrush";
	bird[29] = "Mountain Bluebird";
	
	initial[30] = "nh";
	state[30] = "New Hampshire";
	capital[30] = "Concord";
	date[30] = "June 21, 1788";
	flower[30] = "Purple Lilac";
	bird[30] = "Purple Finch";
	
	initial[31] = "vt";
	state[31] = "Vermont";
	capital[31] = "Montpelier";
	date[31] = "March 4, 1791";
	flower[31] = "Red Clover";
	bird[31] = "Hermit Thrush";
	
	initial[32] = "nj";
	state[32] = "New Jersey";
	capital[32] = "Trenton";
	date[32] = "December 18, 1787";
	flower[32] = "Violet";
	bird[32] = "Eastern Goldfinch";
	
	initial[33] = "nm";
	state[33] = "New Mexico";
	capital[33] = "Santa Fe";
	date[33] = "January 6, 1912";
	flower[33] = "Yucca";
	bird[33] = "Road Runner";
	
	initial[34] = "ny";
	state[34] = "New York";
	capital[34] = "Albany";
	date[34] = "July 26, 1788";
	flower[34] = "Rose";
	bird[34] = "Bluebird";
	
	initial[35] = "nc";
	state[35] = "North Carolina";
	capital[35] = "Raleigh";
	date[35] = "November 21, 1789";
	flower[35] = "Flowering Dogwood";
	bird[35] = "Cardinal";
	
	initial[36] = "wy";
	state[36] = "Wyoming";
	capital[36] = "Cheyenne";
	date[36] = "July 10, 1890";
	flower[36] = "Indian Paintbrush";
	bird[36] = "Meadowlark";
	
	initial[37] = "nd";
	state[37] = "North Dakota";
	capital[37] = "Bismarck";
	date[37] = "November 2, 1889";
	flower[37] = "Prairie Rose";
	bird[37] = "Meadowlark";
	
	initial[38] = "oh";
	state[38] = "Ohio";
	capital[38] = "Columbus";
	date[38] = "March 1, 1803";
	flower[38] = "Scarlet Carnation";
	bird[38] = "Cardinal";
	
	initial[39] = "ok";
	state[39] = "Oklahoma";
	capital[39] = "Oklahoma City";
	date[39] = "November 16, 1907";
	flower[39] = "Mistletoe";
	bird[39] = "Scissor-tailed Flycatcher";
	
	initial[40] = "or";
	state[40] = "Oregon";
	capital[40] = "Salem";
	date[40] = "February 14, 1859";
	flower[40] = "Oregon Grape";
	bird[40] = "Western Meadowlark";
	
	initial[41] = "pa";
	state[41] = "Pennsylvania";
	capital[41] = "Harrisburg";
	date[41] = "December 12, 1787";
	flower[41] = "Mountain Laurel";
	bird[41] = "Ruffed Grouse";
	
	initial[42] = "sc";
	state[42] = "South Carolina";
	capital[42] = "Columbia";
	date[42] = "May 23, 1788";
	flower[42] = "Yellow Jessamine";
	bird[42] = "Carolina Wren";
	
	initial[43] = "sd";
	state[43] = "South Dakota";
	capital[43] = "Pierre";
	date[43] = "November 2, 1889";
	flower[43] = "Pasqueflower";
	bird[43] = "Ring-necked Pheasant";
	
	initial[44] = "tx";
	state[44] = "Texas";
	capital[44] = "Austin";
	date[44] = "December 29, 1845";
	flower[44] = "Bluebonnet";
	bird[44] = "Mockingbird";
	
	initial[45] = "ut";
	state[45] = "Utah";
	capital[45] = "Salt Lake City";
	date[45] = "January 4, 1896";
	flower[45] = "Sego Lily";
	bird[45] = "Sea Gull";
	
	initial[46] = "va";
	state[46] = "Virginia";
	capital[46] = "Richmond";
	date[46] = "June 26, 1788";
	flower[46] = "Dogwood";
	bird[46] = "Cardinal";
	
	initial[47] = "wa";
	state[47] = "Washington";
	capital[47] = "Olympia";
	date[47] = "November 11, 1889";
	flower[47] = "Coast Rhododendron";
	bird[47] = "Willow Goldfinch";
	
	initial[48] = "wv";
	state[48] = "West Virginia";
	capital[48] = "Charleston";
	date[48] = "June 20, 1863";
	flower[48] = "Rhododendron";
	bird[48] = "Cardinal";
	
	initial[49] = "wi";
	state[49] = "Wisconsin";
	capital[49] = "Madison";
	date[49] = "May 29, 1848";
	flower[49] = "Wood Violet";
	bird[49] = "Robin";
	var found = false;
    if (args.length > 0)
    {
    	for(var i = 0;i<initial.length;i++){
    		if(args == initial[i]){
    			found = true;
    			_StdIn.putText("State: " + state[i]);
    			_StdIn.advanceLine();
    			_StdIn.putText("Capital: " + capital[i]);
    			_StdIn.advanceLine();
    			_StdIn.putText("Est: " + date[i]);
    			_StdIn.advanceLine();
    			_StdIn.putText("State Flower: " + flower[i]);
    			_StdIn.advanceLine();
    			_StdIn.putText("State Bird: " + bird[i]);
    		}

    	}
    	if(!found){
    		_StdIn.putText("Please enter a US State abbreviation");
    	}
    	}
    else
    {
        _StdIn.putText("Usage: stateInfo <string>  Please supply a state abbrev..");
    }

}