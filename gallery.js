var img = new Image();
img.crossOrigin = 'anonymous';
img.id="featuredimage"
img.src = 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg';


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

img.onload = function() {
    resizeImage()
};

function resizeImage(){
    canvas.width=400;
    canvas.height=300;

    var w=img.width;
    var h=img.height;

    // resize img to fit in the canvas
    // You can alternately request img to fit into any specified width/height
    var sizer=scalePreserveAspectRatio(w,h,canvas.width,canvas.height);

    ctx.drawImage(img,0,0,w,h,0,0,w*sizer,h*sizer);
}

function scalePreserveAspectRatio(imgW,imgH,maxW,maxH){
    return(Math.min((maxW/imgW),(maxH/imgH)));
}

function setImage(url){
    img.src=url;
    resizeImage();
}

var original = function() {
    resizeImage()
};

var sepia = function() {
    resizeImage()
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        let red = data[i], green = data[i + 1], blue = data[i + 2];

        data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
        data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
        data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
    }
    ctx.putImageData(imageData, 0, 0);
}

var invert = function() {
    resizeImage()
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        data[i]     = 255 - data[i];     // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }
    ctx.putImageData(imageData, 0, 0);
};

var grayscale = function() {
    resizeImage()
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
};