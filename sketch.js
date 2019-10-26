let img;

function preload() {
    createCanvas(720, 400);
    img = loadImage(document.getElementById("myImage").innerHTML); // Load the image

}
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#myImage').attr('src', e.target.result)
                .width(150).height(200)
        };
        reader.readAsDataURL(input.files[0]);
        handleFiles(input.files[0], input.files[0].name);
    }

}

function selectImage() {

}
function myFunction(input) {
    document.getElementById("sub").innerHTML = "YOU CLICKED ME!";
    handleFiles(input.files[0]);
}

function download(filename) {
    var element = document.createElement('a');
    element.setAttribute('href', "data:image/svg+xml;," + Potrace.getSVG(1));
    element.setAttribute('download', filename + ".svg");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function handleFiles(file, name) {
    Potrace.loadImageFromFile(file);
    Potrace.process(function () {
        download(name);
    });
}


function draw() {
    // image(document.getElementById("imageforpancake"), 0,0);
    //  img = loadImage(document.getElementById("myImage").innerHTML); // Load the image

    // image(img, 0,0);
}