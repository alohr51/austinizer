/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "Austinizer";  // An Austin Powers Themed Operating System
var APP_VERSION = "3.11";   

var CPU_CLOCK_INTERVAL = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;  


//
// Global Variables
//
var _CPU = null;

var _OSclock = 0;       // Page 23.

var _Mode = 0;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas = null;               // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.
var _CanvasBuffer = null;
var _ContexBuffer = null;
var _Pid = 0;
var readyQueue = new Array();
// Default the OS trace to be on.
var _Trace = true;
var _coreMem = null;
var _currentPCB = null;
var _memoryManager = null;
var _CPU = null;
var _MemoryStart = "0000";
var _2ndMemoryStart = "0040";
var _3rdMemoryStart = "0080";
// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;
var _Quantum = 1;
var ActivePids = new Array();
// Standard input and output
var _StdIn  = null;
var _StdOut = null;
var _ProgramsStored = 0;
// UI
var _Console = null;
var _OsShell = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
//the os is groovy baby, yeah!
var _Austin=false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;
