let img;

function preload() {
    createCanvas(720, 400);
    img = loadImage(document.getElementById("myImage").innerHTML); // Load the image

}

function readURL(input) {
   // var timestamp = date.getTime();
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#myImage').attr('src', e.target.result)
                .width(150).height(200)
        };
        reader.readAsDataURL(input.files[0]);
        handleFiles(input.files[0], input.files[0].name);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/server', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Request finished. Do processing here.
            }
        }
        var t = JSON.parse('{"name": "", "data": ""}');

        xhr.send(t.name);
        xhr.send(t.data);
     //   xhr.send(timestamp);
        // xhr.send(new Int8Array()); 
        // xhr.send(document);
        //XMLHttpRequest.send(input.files[0]);
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

    //element.setAttribute('download', filename + ".svg");

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
