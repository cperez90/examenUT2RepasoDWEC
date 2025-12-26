const img = new Image();
img.crossOrigin = 'anonymous';
img.id="featuredimage"
img.src = 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg';


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const radioOriginal = document.querySelector('#original');
const radioGrayscale = document.querySelector('#grayscale');
const radioInvert = document.querySelector('#inverted');
const radioSepia = document.querySelector('#sepia');
const items = document.querySelectorAll('.gallery .item');

img.onload = function() {
    resizeImage()
};

function resizeImage(){
    canvas.width=400;
    canvas.height=300;

    const w=img.width;
    const h=img.height;

    // resize img to fit in the canvas
    // You can alternately request img to fit into any specified width/height
    const sizer=scalePreserveAspectRatio(w,h,canvas.width,canvas.height);

    ctx.drawImage(img,0,0,w,h,0,0,w*sizer,h*sizer);
}

function scalePreserveAspectRatio(imgW,imgH,maxW,maxH){
    return(Math.min((maxW/imgW),(maxH/imgH)));
}

function setImage(url){
    img.src=url;
    resizeImage();
}

const original = function() {
    resizeImage()
};

const sepia = function() {
    resizeImage()
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let red = data[i], green = data[i + 1], blue = data[i + 2];

        data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
        data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
        data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
    }
    ctx.putImageData(imageData, 0, 0);
}

const invert = function() {
    resizeImage()
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i]     = 255 - data[i];     // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }
    ctx.putImageData(imageData, 0, 0);
};

const grayscale = function() {
    resizeImage()
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
};

radioOriginal.addEventListener('change', function () {
    original();
});

radioGrayscale.addEventListener('change', function () {
    grayscale();
});

radioInvert.addEventListener('change', function () {
    invert();
});

radioSepia.addEventListener('change', function () {
    sepia();
});

items.forEach(function (item){
    const img = item.querySelector('img');
    const imgUrl = img.src;

    const btn = document.createElement('button');
    btn.textContent = 'View image';

    btn.addEventListener('click',function () {
        setImage(imgUrl);
    });

    item.appendChild(btn);
})