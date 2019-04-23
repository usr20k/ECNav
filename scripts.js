var realWidth = document.getElementById("map").width * 1.0;
    var zoomLevel = 0;
    //left off implementing realTop and realLeft for bubbles position, same as realWidth, account for multiplicative truncation.
    function loadImage(img){
      document.getElementById("map").src = img;
    }

  	//pinDrop function, passes in x and y paramaters and drops pin at that location.
    function pinDrop(x,y) {
      if(zoomLevel<0){
        while(zoomLevel<0){
          zoomIn();
        }
      }
      while(zoomLevel>0){
        zoomOut();
      }
      document.getElementsByClassName("speech-bubble")[0].style.display = "block";
      document.getElementsByClassName("speech-bubble")[0].style.top = (y-document.getElementsByClassName("speech-bubble")[0].offsetHeight+15) + "px";
      document.getElementsByClassName("speech-bubble")[0].style.left = (x-document.getElementsByClassName("speech-bubble")[0].offsetWidth+20) + "px";
      
      while(zoomLevel!=-8){
        zoomOut();
      }
      document.getElementById("mapDiv").scrollLeft = x * Math.pow(8/7,zoomLevel) - document.getElementById("mapDiv").offsetWidth/2;
      document.getElementById("mapDiv").scrollTop = y * Math.pow(8/7,zoomLevel) - document.getElementById("mapDiv").offsetHeight/2;
      
	  }
    function displayInfo(roomNum){
      document.getElementsByClassName("speech-bubble")[0].innerHTML = roomNum;
    }

	function zoomIn(){
    if(zoomLevel<0){
      zoomLevel++;
  		realWidth = parseFloat(realWidth* (8/7));
      document.getElementById("map").width = realWidth;
  		var pixelCords = document.getElementsByClassName("speech-bubble")[0];
      document.getElementsByClassName("speech-bubble")[0].style.top = (((pixelCords.offsetTop-pixelCords.offsetHeight+10)*(8/7)) + (pixelCords.offsetHeight)+5) + "px";
      document.getElementsByClassName("speech-bubble")[0].style.left = ((((pixelCords.offsetLeft)-pixelCords.offsetWidth+20)*(8/7)) + (pixelCords.offsetWidth)+4) + "px";
      document.getElementById("mapDiv").scrollTop  = ((document.getElementById("mapDiv").scrollTop+(document.getElementById("mapDiv").offsetHeight/2)) * 8/7) - (document.getElementById("mapDiv").offsetHeight/2);
      document.getElementById("mapDiv").scrollLeft = ((document.getElementById("mapDiv").scrollLeft +(document.getElementById("mapDiv").offsetWidth/2)) * 8/7) - (document.getElementById("mapDiv").offsetWidth/2);
    }
  }
	function zoomOut(){
    if(zoomLevel>-13){
      zoomLevel--;
      realWidth = parseFloat(realWidth* (7/8));
  		document.getElementById("map").width =realWidth.toFixed(0);
  		var pixelCords = document.getElementsByClassName("speech-bubble")[0];
      document.getElementsByClassName("speech-bubble")[0].style.top = (((pixelCords.offsetTop-pixelCords.offsetHeight-10)*(7/8)) + (pixelCords.offsetHeight)-6)+ "px";
      document.getElementsByClassName("speech-bubble")[0].style.left = ((((pixelCords.offsetLeft)-pixelCords.offsetWidth-20)*(7/8)) + (pixelCords.offsetWidth)-6) + "px";
      document.getElementById("mapDiv").scrollTop  = ((document.getElementById("mapDiv").scrollTop+(document.getElementById("mapDiv").offsetHeight/2)) * 7/8) - (document.getElementById("mapDiv").offsetHeight/2);
      document.getElementById("mapDiv").scrollLeft = ((document.getElementById("mapDiv").scrollLeft +(document.getElementById("mapDiv").offsetWidth/2)) * 7/8) - (document.getElementById("mapDiv").offsetWidth/2);
    }
	}


  function status(){
      loadInfo("TestRoom",4575,3870,"map.jpg");
	}
 function loadInfo(roomNum,x,y,img){
  if(document.getElementById("map").src != img){
    loadImage(img);
  }
  displayInfo(roomNum);
  pinDrop(x,y);
 }
