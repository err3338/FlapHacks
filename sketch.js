let img;

function preload(){
      createCanvas(720, 400);
  img = loadImage(document.getElementById("myImage").innerHTML); // Load the image

}
function readURL(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            $('#myImage').attr('src', e.target.result)
            .width(150).height(200)
        };
        reader.readAsDataURL(input.files[0]);
            
        }
    
    }

function selectImage(){
    
}
function myFunction() {
  document.getElementById("sub").innerHTML = "YOU CLICKED ME!";
}

function draw(){
   // image(document.getElementById("imageforpancake"), 0,0);
    //  img = loadImage(document.getElementById("myImage").innerHTML); // Load the image

    // image(img, 0,0);
}