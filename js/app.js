var app={};
var podo;
app.init = function () {
  console.log("app.init");
	//var lock = window.navigator.requestWakeLock('screen');

	app.widthCanvas  = window.innerWidth*5/6;
	app.heightCanvas = window.innerHeight/2;
	app.dessin, app.context;

	app.podo_stepSize = localStorage.podo_stepSize || 50;
  app.podo_weight = localStorage.podo_weight || 70;
	app.podo_step = localStorage.podo_step || 0;
	app.podo_speed = localStorage.podo_speed || 0;
	app.podo_calory = localStorage.podo_calory || 0;
	app.isGPSEnabled = localStorage.isGPSEnabled || false;

	podo = new Pedometer();


	//init pedometer
	podo.setCountStep(Math.round(app.podo_step));
	podo.setWeight(Math.round(app.podo_weight));
	podo.setStepSize(Math.round(app.podo_stepSize));
	podo.setMeanSpeed(Math.round(app.podo_speed*1000.)/1000.);
	podo.setCalory(Math.round(app.podo_calory*1000.)/1000.);
	podo.setIsGPSEnabled(Boolean(app.isGPSEnabled));

	app.activatePodo = 1;

	//---------------
	// GPS event
	//---------------
	window.addEventListener("compassneedscalibration", function(event) {
		alert('Your compass needs calibrating! Wave your device in a figure-eight motion');
		event.preventDefault();
	}, true);
  var oldAcceleration = [0, 0, 0];
    var isChange = 0;
    var stepCount = 0;
    var scrollAmount = 30;

      document.getElementById("DeviceMotionMsg").innerHTML = "dig";
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', (e) => {
              document.getElementById("DeviceMotionMsg").innerHTML = "DeviceMotion";
              var info, xyz = "[X, Y, Z]";
              var acceleration = e.acceleration;
              info = xyz.replace("X", acceleration.x);
              info = info.replace("Y", acceleration.y);
              info = info.replace("Z", acceleration.z);
              document.getElementById("moAccel").innerHTML = info;

              acceleration = e.accelerationIncludingGravity;
              info = xyz.replace("X", acceleration.x);
              info = info.replace("Y", acceleration.y);
              info = info.replace("Z", acceleration.z);
              document.getElementById("moAccelGrav").innerHTML = info;

              // Grab the rotation rate from the results
              var rotation = e.rotationRate;
              info = xyz.replace("X", rotation.alpha);
              info = info.replace("Y", rotation.beta);
              info = info.replace("Z", rotation.gamma);
              document.getElementById("moRotation").innerHTML = info;


              info = e.interval;
              document.getElementById("moInterval").innerHTML = info;
              // compare with old acceleration
              var dot = 	(oldAcceleration.x * acceleration.x) +
                    (oldAcceleration.y * acceleration.y) +
                    (oldAcceleration.z * acceleration.z);

              var a = Math.abs(Math.sqrt(		Math.pow(oldAcceleration.x,2) +
                              Math.pow(oldAcceleration.y,2) +
                              Math.pow(oldAcceleration.z,2)));

              var b = Math.abs(Math.sqrt(		Math.pow(acceleration.x,2) +
                              Math.pow(acceleration.y,2) +
                              Math.pow(acceleration.z,2)));

              dot /= (a * b);

              //console.log(dot);

              if(dot <= 0.994 && dot > 0.90){ //bounce
                //console.log("bounce");
                //console.log("step count: " + stepCount + ", isChange: " + isChange);
                if(isChange == 0){
                  stepCount+=1;
                  stepDetected();
                } else {
                  if(isChange == 3){
                    isChange = -1;
                  }
                }
                isChange+=1;
              }
              // set old acceleration to current
              oldAcceleration = acceleration;

              // display step count
              document.getElementById("moStepCount").innerHTML = stepCount;
            });
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
    }

  // var norm     = 0;
  //   document.getElementById("devicemotion").innerHTML="?";
  // if (window.DeviceOrientationEvent) {
  //     document.getElementById("DeviceOrientationEvent").innerHTML="DeviceOrientationEvent";
  //
  // 		window.addEventListener("devicemotion", function( event ) {
  //       document.getElementById("devicemotion").innerHTML="devicemotion";
  // 			if (app.activatePodo){
  // 				if ((podo.acc_norm.length < 2) || (podo.stepArr.length < 2))
  // 				{
  // 					//$("#gamma-angle").html(Math.round(2/(event.interval/1000)));
  // 					podo.createTable(Math.round(2/(event.interval/1000)));
  // 				} else {
  // 					norm = podo.computeNorm(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z);
  // 					podo.acc_norm.push(norm);
  //
  // 					podo.update();
  //
  // 					podo.onStep(podo.acc_norm);
  // 					podo.onSpeed();
  // 					podo.onCalory();
  //
  // 					//app.dessin  = document.querySelector('#canvas');
  // 					//app.context = app.dessin.getContext('2d');
  // 					//podo.onDraw(app.context, app.widthCanvas, app.heightCanvas);
  //
  // 					if ((localStorage.podo_step !== 0) && (isNaN(podo.countStep) == 0))
  // 					{
  // 						app.podo_step = localStorage.podo_step = podo.countStep;
  // 					};
  // 					if ((localStorage.podo_speed !== 0) && (isNaN(podo.meanSpeed) == 0))
  // 					{
  // 						app.podo_speed = localStorage.podo_speed = podo.meanSpeed;
  // 					};
  // 					if ((localStorage.podo_calory !== 0) && (isNaN(podo.calory) == 0))
  // 					{
  // 						app.podo_calory = localStorage.podo_calory = podo.calory;
  // 					};
  //
  // 					if (isNaN(podo.distance) == 0){
  // 						document.getElementById("distance-number").innerHTML= Math.round(podo.distance/100)/1000;
  // 					} else {
  // 						document.getElementById("#distance-number").innerHTML=0;
  // 					};
  // 					if (isNaN(podo.meanSpeed) == 0){
  // 						document.getElementById("speed-number").innerHTML=Math.round(podo.meanSpeed/1000*3600); //km/h
  // 					} else {
  // 						document.getElementById("speed-number").innerHTML=0;
  // 					};
  // 					if (isNaN(podo.calory) == 0){
  // 						document.getElementById("calory-number").innerHTML=Math.round(podo.calory); //km/h
  // 					} else {
  // 						document.getElementById("calory-number").innerHTML=0;
  // 					};
  // 				};
  // 			};
  // 		}, false);
  // 	};

};
