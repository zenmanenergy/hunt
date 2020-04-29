
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
    console.log("init");
    try{


      DeviceMotionEvent.requestPermission()
      .then(response => {
          if (response == 'granted') {

              window.addEventListener('devicemotion', (e) => {
                
                  document.getElementById("accelX").innerHTML = e.accelerationIncludingGravity.x;
                  document.getElementById("accelY").innerHTML = e.accelerationIncludingGravity.y;
                  document.getElementById("accelZ").innerHTML = e.accelerationIncludingGravity.z;

              })
          }
      })
      .catch(console.error)
    } catch(err){
      console.log("no motion permission")
    }
  };
};
