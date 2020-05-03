
function Compass(){
  //this parent variable is necessary to fix a flaw in Javascript that
  //doesn't allow callback functions to access the parent object.
  var parent = this;

  this.cardinalDirection="N";
  this.interCardinalDirection="N";
  this.heading=0;
  this.hasPermission=false;
  this.onChange=function(heading, cardinalDirection, interCardinalDirection){
    console.log("[Compass]","compass.onChange event. This method can be overriden using: compass.onChange=function(latitude, longitude, accuracy, timestamp){} ")
    console.log(heading, cardinalDirection, interCardinalDirection);
  };
  this.onError=function(type, message, error){
    console.log("[Compass]","compass.onError event. This method can be overriden using: compass.onError=function(type, message, error){} ");
    console.log(type, message, error);
  };
  this.setHeading = function(_heading){
    this.heading=_heading;
    if ((this.heading >= 315 && this.heading < 360) || (this.heading >= 0 && this.heading < 45)){
      this.cardinalDirection="N";

    }
    else if (this.heading >= 45 && this.heading < 135) {
      this.cardinalDirection="E";
    }
    else if (this.heading >= 135 && this.heading < 225){
      this.cardinalDirection="S";
    }
    else if (this.heading >= 225 && this.heading < 315){
      this.cardinalDirection="W";
    }

    if ((this.heading >= 337 && this.heading < 360) || (this.heading >= 0 && this.heading < 22)){
      this.interCardinalDirection="N";
    } else if ((this.heading >= 22 && this.heading < 67)){
      this.interCardinalDirection="NE";
    } else if (this.heading >= 67 && this.heading < 112) {
      this.cardinalDirection="E";
    } else if (this.heading >= 112 && this.heading < 157) {
      this.cardinalDirection="SE";
    } else if ((this.heading >= 157 && this.heading < 202)){
      this.interCardinalDirection="S";
    } else if ((this.heading >= 202 && this.heading < 248)){
      this.interCardinalDirection="SW";
    } else if ((this.heading >= 248 && this.heading < 292)){
      this.interCardinalDirection="W";
    } else if ((this.heading >= 292 && this.heading < 337)){
      this.interCardinalDirection="NW";
    }
    this.onChange(this.heading, this.cardinalDirection, this.interCardinalDirection);

  }
  this.init = function (){
    try{
      DeviceOrientationEvent.requestPermission()
      .then(response => {
          if (response == 'granted') {
            this.hasPermission=true;
              window.addEventListener('deviceorientation', (e) => {
                  // do something with e
                  //orientationEvent(e);
                  //parent.orientation=e;
                  // document.getElementById("DeviceOrientationMsg").innerHTML = "DeviceOrientation";
                  // document.getElementById("doTiltLR").innerHTML = Math.round(e.gamma);
                  // document.getElementById("doTiltFB").innerHTML = Math.round(e.beta);
                  // document.getElementById("doDirection").innerHTML = 360-Math.round(e.alpha);
                  //parent.heading = 360-Math.round(e.alpha);
                  parent.setHeading(Math.round(e.webkitCompassHeading));

              })
          } else{

            // console.log("compass " + response);
          }
      })
      .catch(console.error)
    } catch(err){
      this.hasPermission=false;
     parent.onError("[Compass] ERROR", "Sorry, browser does not have compass permission");
    }

  }
}
