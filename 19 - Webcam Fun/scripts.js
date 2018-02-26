const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio:false})
       .then(localMediaStream => {
           console.log(localMediaStream);
           video.src = window.URL.createObjectURL(localMediaStream);
           video.play();
       })
       .catch(err=> {
           console.error(`There is a problem...`,err);
       });
}


function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    console.log(width,height);
    canvas.width = width;
    canvas.height = height;

    //we could just setInterval, but if we add 'return' then we have access to the interval and can clear it if needed
    //anything I want to do with the image needs to happen here in this setInterval function
    return setInterval(() =>{
        ctx.drawImage(video,0,0,width,height);

        //take pixels out of the image
        let pixels = ctx.getImageData(0,0,width,height);
        //add transparency for 'ghosting'
        ctx.globalAlpha =0.1;
        
        //console.log(pixels);

        //modify pixel rgb values
        //pixels = redEffect(pixels);
        //pixels = blueEffect(pixels);
        pixels = rgbSplit(pixels);

        //put them back onto the canvas
        ctx.putImageData(pixels,0,0);
    },50);
}

function takePhoto() {

    //makes the camera click sound
    snap.currentTime =0;
    snap.play();

    //take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    console.log(data);  //base-64 data representing photo
    const link = document.createElement('a');
    link.href = data;
    //this next line will download the image and name it 'lovely.jpeg'
    link.setAttribute('download','lovely');

    //this next line placed the text 'Download Image' at the bottom of the canvas.
    //In place of that we'll have a small picture
    //link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="Lovely Person" />`;

    strip.insertBefore(link, strip.firstChild);
}
 

//now we want to apply filters to the photos

function redEffect(pixels){

    //increment i by 4 to handle each pixel by type
    //the modifications are random-ish; hoping for a red-like image
    //modify pixel values towards red and return them to the same location
  
        //he opened up an image file and explained that:
        //datapoint 1 is the 'red' content of the first pixel
        //datapoint 2 is the 'green' content of the first pixel
        //datapoint 3 is the 'blue' content of the first pixel
        //datapoint 4 is the 'alpha' content of the first pixel
        //and so it repeats for every pixel.  so we can loop:
  
    for(let i=0; i<pixels.data.length;i+=4){
        pixels.data[i+0] = pixels.data[i+0]+100; //red
        pixels.data[i+1] = pixels.data[i+1]-50; //green
        pixels.data[i+2] = pixels.data[i+2]*0.5; //blue
    }
    return pixels;
}       //end of redEffect

function blueEffect(pixels){

    //increment i by 4 to handle each pixel by type
    //the modifications are random-ish; hoping for a red-like image
    //modify pixel values towards red and return them to the same location
  
        //he opened up an image file and explained that:
        //datapoint 1 is the 'red' content of the first pixel
        //datapoint 2 is the 'green' content of the first pixel
        //datapoint 3 is the 'blue' content of the first pixel
        //datapoint 4 is the 'alpha' content of the first pixel
        //and so it repeats for every pixel.  so we can loop:
  
    for(let i=0; i<pixels.data.length;i+=4){
        pixels.data[i+0] = pixels.data[i+0]-100; //red
        pixels.data[i+1] = pixels.data[i+1]-50; //green
        pixels.data[i+2] = pixels.data[i+2]+100; //blue
    }
    return pixels;
}       //end of redEffect

function rgbSplit(pixels){

    //increment i by 4 to handle each pixel by type
    //the modifications are random-ish; hoping for a red-like image
    //modify pixel values towards red and return them to the same location
  
        //he opened up an image file and explained that:
        //datapoint 1 is the 'red' content of the first pixel
        //datapoint 2 is the 'green' content of the first pixel
        //datapoint 3 is the 'blue' content of the first pixel
        //datapoint 4 is the 'alpha' content of the first pixel
        //and so it repeats for every pixel.  so we can loop:
  
    for(let i=0; i<pixels.data.length;i+=4){
        pixels.data[i-150] = pixels.data[i+0]; //red
        pixels.data[i+300] = pixels.data[i+1]; //green
        pixels.data[i-550] = pixels.data[i+2]; //blue
    }
    return pixels;
}       //end of redEffect




getVideo();

//don't paint to canvas until we have video data (sort of like document ready)
//- when the video is playing it will emit an event called 'canplay' that we can listen for
video.addEventListener('canplay',paintToCanvas);