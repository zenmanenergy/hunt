
function Pedometer(){
  //this parent variable is necessary to fix a flaw in Javascript that
  //doesn't allow callback functions to access the parent object.
  var parent = this;
  console.log("pedometer constructor");


  this.hasPermission=false;
  this.steps=0;
  this.distance=0;


  this.reset=function(){
    this.steps=0;
    this.distance=0;
  };
  this.onChange=function(steps,distance){
    console.log("[Pedometer]","pedometer.onChange event. This method can be overriden using: pedometer.onChange=function(steps,distance){} ")
    console.log(heading, cardinalDirection, interCardinalDirection);
  };
  this.onError=function(type, message, error){
    console.log("[Pedometer]","pedometer.onError event. This method can be overriden using: pedoemeter.onError=function(type, message, error){} ");
    console.log(type, message, error);
  };
  this.init = function (){
    console.log("pedometer init");
    try{


      DeviceMotionEvent.requestPermission()
      .then(response => {
          if (response == 'granted') {
            console.log("pedometer granted");

              window.addEventListener('devicemotion', (e) => {

                  document.getElementById("accelX").innerHTML = e.accelerationIncludingGravity.x;
                  document.getElementById("accelY").innerHTML = e.accelerationIncludingGravity.y;
                  document.getElementById("accelZ").innerHTML = e.accelerationIncludingGravity.z;

                  // if ((podo.acc_norm.length < 2) || (podo.stepArr.length < 2)){
                  //   podo.createTable(Math.round(2/(event.interval/1000)));
                  // } else {
                  //
                  // }
              })
          }else{

            console.log("pedometer " + response);
          }
      })
      .catch(console.error)
    } catch(err){
      console.log("no pedometer permission");
    }
  };






  //private
  this.acc_norm = new Array(); // amplitude of the acceleration

	this.var_acc   = 0.; // variance of the acceleration on the window L
	this.min_acc   = 1./0.;  // minimum of the acceleration on the window L
	this.max_acc   = -1./0.; // maximum of the acceleration on the window L
	this.threshold = -1./0.; // threshold to detect a step
	this.sensibility = 1./30.;  // sensibility to detect a step

	this.countStep = 0;           // number of steps
	this.stepArr   = new Array(); // steps in 2 seconds

  this.createTable = function(lWindow) {
    this.acc_norm = new Array(lWindow);
    this.stepArr = new Array(lWindow);
  };

  this.filter = new Kalman();

};

var Kalman=function() {
  this.G  = 1; // filter gain
  this.Rw = 1; // noise power desirable
  this.Rv = 10; // noise power estimated

  this.A = 1;
  this.C = 1;
  this.B = 0;
  this.u = 0;
  this.P = NaN;
  this.x = NaN; // estimated signal without noise
  this.y = NaN; //measured


  this.onFilteringKalman = function(ech)//signal: signal measured
  {
    this.y = ech;

    if (isNaN(this.x)) {
      this.x = 1/this.C * this.y;
      this.P = 1/this.C * this.Rv * 1/this.C;
    }
    else {
      // Kalman Filter: Prediction and covariance P
      this.x = this.A*this.x + this.B*this.u;
      this.P = this.A * this.P * this.A + this.Rw;
      // Gain
      this.G = this.P*this.C*1/(this.C*this.P*this.C+this.Rv);
      // Correction
      this.x = this.x + this.G*(this.y-this.C*this.x);
      this.P = this.P - this.G*this.C*this.P;
    };
    return this.x;
  };

  this.setRv = function(Rv)//signal: signal measured
  {
    this.Rv = Rv;
  };
};
