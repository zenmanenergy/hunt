
function Kalman () {
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

                  if ((podo.acc_norm.length < 2) || (podo.stepArr.length < 2)){
                    parent.createTable(Math.round(2/(e.interval/1000)));
                  } else {
                    parent.acc_norm.push(parent.computeNorm(e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.z));
                    parent.acc_norm.shift();
                    parent.onStep();
                  }
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






  //private s
  this.acc_norm = new Array(); // amplitude of the acceleration

	this.var_acc   = 0.; // variance of the acceleration on the window L
	this.min_acc   = 1./0.;  // minimum of the acceleration on the window L
	this.max_acc   = -1./0.; // maximum of the acceleration on the window L
	this.threshold = -1./0.; // threshold to detect a step
	this.sensibility = 1./30.;  // sensibility to detect a step

	this.stepArr   = new Array(); // steps in 2 seconds

  this.createTable = function(lWindow) {
    this.acc_norm = new Array(lWindow);
    this.stepArr = new Array(lWindow);
  };

  this.filter = new Kalman();
  this.computeNorm = function(x,y,z) {
		var norm = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
		var norm_filt = this.filter.onFilteringKalman(norm);

		return norm_filt/9.80665;
	};
  this.onStep = function() {
		this.varAcc(this.acc_norm);
		this.min_acc = this.minAcc(this.acc_norm);
		this.max_acc = this.maxAcc(this.acc_norm);

		this.setThreshold(this.min_acc, this.max_acc);

		var diff = this.max_acc - this.min_acc;

		var isSensibility   = (Math.abs(diff) >= this.sensibility)// the acceleration has to go over the sensibility
		var isOverThreshold = ((this.acc_norm[this.acc_norm.length-1] >= this.threshold) && (this.acc_norm[this.acc_norm.length-2] < this.threshold));// if the acceleration goes over the threshold and the previous was below this threshold
		var isValidStep     = (this.stepArr[this.stepArr.length-1] == 0);

		if (isSensibility && isOverThreshold && isValidStep) {
			this.steps++;
      this.onChange(this.steps,"incomplete");
			this.stepArr.push(1);
			this.stepArr.shift();

			// // Distance
			// if (Boolean(this.isGPSEnabled) && Boolean(this.isGPSReceived)) {
			// 	this.setDistanceGPS();
			// 	var nStepGPS = Math.round(this.distance/this.steps);
			// 	if (this.steps < nStepGPS) {
			// 		this.steps = nStepGPS;
			// 	};
			// } else {
			// 	this.setDistance();
			// };
		} else {
			this.stepArr.push(0);
			this.stepArr.shift();
		};
	};

  // seek variance
	this.varAcc = function(acc) {
		var moy  = 0.;//mean
		var moy2 = 0.;//square mean
		for (var k = 0; k < acc.length-1; k++) {
			moy += acc[k];
			moy2 += Math.pow(acc[k],2);
		};
		this.var_acc = (Math.pow(moy,2) - moy2)/acc.length;
		if (this.var_acc - 0.5 > 0.) {
				this.var_acc -= 0.5;
		};
		if (isNaN(this.var_acc) == 0) {
			this.filtre.setRv(this.var_acc);
			this.setSensibility(2.*Math.sqrt(this.var_acc)/Math.pow(9.80665,2));
		}
		else {
			this.setSensibility(1./30.);
		};
	};

	// seek minimum
	this.minAcc = function(acc) {
		var mini = 1./0.;
		for (var k = 0; k < acc.length; k++) {
			if (acc[k] < mini)
			{
				mini = acc[k];
			};
		};
		return mini;
	};

	// seek maximum
	this.maxAcc = function(acc) {
		var maxi = -1./0.;
		for (var k = 0; k < acc.length; k++) {
			if (acc[k] > maxi)
			{
				maxi = acc[k];
			};
		};
		return maxi;
	};

	// compute the threshold
	this.setThreshold = function(min, max) {
		this.threshold = (min+max)/2;
	};
  this.setSensibility = function(sensibility) {
		this.sensibility = sensibility;
	};
};
