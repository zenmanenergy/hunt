
function Compass(){
  //this parent variable is necessary to fix a flaw in Javascript that
  //doesn't allow callback functions to access the parent object.
  var parent = this;

  this.cardinalDirection;
  this.interCardinalDirection;
  this.heading;
  this.hasPermission=false;

  this.onChange=function(heading, cardinalDirection, interCardinalDirection){
    console.log("[Compass]","compass.onChange event. This method can be overriden using: compass.onChange=function(latitude, longitude, accuracy, timestamp){} ")
    console.log(heading, cardinalDirection, interCardinalDirection);
  };
  this.onError=function(type, message, error){
    console.log("[Compass]","compass.onError event. This method can be overriden using: compass.onError=function(type, message, error){} ");
    console.log(type, message, error);
  };
  this.init = function (){
    try{
      DeviceOrientationEvent.requestPermission()
      .then(response => {
          if (response == 'granted') {
            this.hasPermission=true;
              window.addEventListener('deviceorientation', (e) => {
                  // do something with e
                  //orientationEvent(e);
                  document.getElementById("DeviceOrientationMsg").innerHTML = "DeviceOrientation";
                  document.getElementById("doTiltLR").innerHTML = Math.round(e.gamma);
                  document.getElementById("doTiltFB").innerHTML = Math.round(e.beta);
                  document.getElementById("doDirection").innerHTML = 360-Math.round(e.alpha);
                  
                  parent.heading = e.webkitCompassHeading;

                  if ((parent.heading >= 315 && parent.heading < 360) || (parent.heading >= 0 && parent.heading < 45)){
                    parent.cardinalDirection="N";

                  }
                  else if (parent.heading >= 45 && parent.heading < 135) {
                    parent.cardinalDirection="E";
                  }
                  else if (parent.heading >= 135 && parent.heading < 225){
                    parent.cardinalDirection="S";
                  }
                  else if (parent.heading >= 225 && parent.heading < 315){
                    parent.cardinalDirection="W";
                  }

                  if ((parent.heading >= 337 && parent.heading < 360) || (parent.heading >= 0 && parent.heading < 22)){
                    parent.interCardinalDirection="N";
                  } else if ((parent.heading >= 22 && parent.heading < 67)){
                    parent.interCardinalDirection="NE";
                  } else if (parent.heading >= 67 && parent.heading < 112) {
                    parent.cardinalDirection="E";
                  } else if (parent.heading >= 112 && parent.heading < 157) {
                    parent.cardinalDirection="SE";
                  } else if ((parent.heading >= 157 && parent.heading < 202)){
                    parent.interCardinalDirection="S";
                  } else if ((parent.heading >= 202 && parent.heading < 248)){
                    parent.interCardinalDirection="SW";
                  } else if ((parent.heading >= 248 && parent.heading < 292)){
                    parent.interCardinalDirection="W";
                  } else if ((parent.heading >= 292 && parent.heading < 337)){
                    parent.interCardinalDirection="NW";
                  }

                  parent.onChange(parent.heading, parent.cardinalDirection, parent.interCardinalDirection);

              })
          }
      })
      .catch(console.error)
    } catch(err){
      this.hasPermission=false;
     parent.onError("[Compass] ERROR", "Sorry, browser does not have compass permission");
    }

  }
}
