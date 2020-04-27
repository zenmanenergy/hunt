
function Compass(){
  this.hasPermission=false;
  this.errorMessage;
  this.requestOrientationPermission = function (){
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
                  heading = 360-Math.round(e.alpha);

                  headingEasy="";
                  if ((heading >= 315 && heading < 360) || (heading >= 0 && heading < 45)){
                    headingEasy="N";
                  }
                  else if (heading >= 45 && heading < 135) {
                    headingEasy="E";
                  }
                  else if (heading >= 135 && heading < 225){
                    headingEasy="S";
                  }
                  else if (heading >= 225 && heading < 315){
                    headingEasy="W";
                  }
                  document.getElementById("heading").innerHTML = heading;
                  document.getElementById("headingEasy").innerHTML = headingEasy;
              })
          }
      })
      .catch(console.error)
  }
}
