let img;
let toGo;
let globalstuff;
let toGoName;
let result;

function readURL(input) {
    // var timestamp = date.getTime();
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#myImage').attr('src', e.target.result)
                .width(150).height(200)
        };
        document.body.style.backgroundImage = "url$('input')";
        reader.readAsDataURL(input.files[0]);
        toGo = input.files[0];

        let str = input.files[0].name;
        str = str.substring(0, str.length - 4);
        input.files[0].name = str;
        console.log(str);
        handleFiles(input.files[0], input.files[0].name);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/server', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        globalstuff = JSON.stringify([{
            "name": str,
            "data": input.files[0].name
        }]);


        xhr.onreadystatechange = function () { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

                // globalstuff= JSON.stringify('[{"name": str , "data": input.files[0].name}]');
                /*       let n = globalstuff[0].name;
                        console.log(n + "asdffdfdfdfdfdf");*/
                // xhr.send(globalstuf.name);
                //  xhr.send(t.data);
            }
        }



        //   xhr.send(timestamp);
        // xhr.send(new Int8Array()); 
        // xhr.send(document);
        //XMLHttpRequest.send(input.files[0]);
    }

}

document.addEventListener('polymer-ready', function () {
    Polymer('main-page', {
        units: 'mm',
        boxWidth: 100,
        boxHeight: 100,
        nutWidth: 6,
        nutThickness: 5,
        nutSpacing: 4,
        screwDiameter: 4,
        jointSize: 15,
        jointDistFromEdge: 20,
        gcode: '',

        material: {
            units: "inch",
            thickness: ".25",
            clearance: "0.1",
        },

        operation: {
            camOp: "Outside",
        },

        ready: function () {
            this.update();
        },

        observe: {
            'material.thickness': 'update',
            'tool.diameter': 'update',
            boxWidth: 'update',
            boxHeight: 'update',
            nutWidth: 'update',
            nutThickness: 'update',
            nutSpacing: 'update',
            screwDiameter: 'update',
            jointSize: 'update',
            jointDistFromEdge: 'update',
        },

        update: function () {
            var boxWidth = jscut.data.toInch(this.boxWidth, this.units);
            var boxHeight = jscut.data.toInch(this.boxHeight, this.units);
            var nutWidth = jscut.data.toInch(this.nutWidth, this.units);
            var nutThickness = jscut.data.toInch(this.nutThickness, this.units);
            var nutSpacing = jscut.data.toInch(this.nutSpacing, this.units);
            var jointSize = jscut.data.toInch(this.jointSize, this.units);
            var jointDistFromEdge = jscut.data.toInch(this.jointDistFromEdge, this.units);
            var screwDiameter = jscut.data.toInch(this.screwDiameter, this.units);
            var thickness = jscut.data.toInch(this.material.thickness, this.material.units);
            var diameter = jscut.data.toInch(this.tool.diameter, this.tool.units);

            var reliefRadius = diameter * 1.1 / 2;

            var leftNutJoint = jscut.geometry.createRect(-diameter, -jointSize / 2, thickness, jointSize / 2, "inch");
            leftNutJoint = jscut.geometry.union(leftNutJoint, jscut.geometry.createRect(
                thickness - reliefRadius * 2, -jointSize / 2 - reliefRadius,
                thickness, jointSize / 2 + reliefRadius, "inch"));
            leftNutJoint = jscut.geometry.union(leftNutJoint, jscut.geometry.createRect(
                thickness + nutSpacing, -nutWidth / 2 - reliefRadius,
                thickness + nutSpacing + nutThickness, nutWidth / 2 + reliefRadius, "inch"));
            leftNutJoint = jscut.geometry.union(leftNutJoint, jscut.geometry.createRect(
                0, -screwDiameter / 2,
                thickness + nutSpacing + nutThickness, screwDiameter / 2, "inch"));
            var bottomNutJoint = jscut.geometry.rotate(leftNutJoint, 90, "deg");
            var rightNutJoint = jscut.geometry.rotate(leftNutJoint, 180, "deg");
            var topNutJoint = jscut.geometry.rotate(leftNutJoint, 270, "deg");

            var jointOffset = jointSize / 2 + jointDistFromEdge;

            var panel = jscut.geometry.createRect(0, 0, boxWidth, boxHeight, "inch");
            panel = jscut.geometry.difference(panel, jscut.geometry.translate(leftNutJoint, 0, jointOffset, "inch"));
            panel = jscut.geometry.difference(panel, jscut.geometry.translate(leftNutJoint, 0, boxHeight - jointOffset, "inch"));
            panel = jscut.geometry.difference(panel, jscut.geometry.translate(bottomNutJoint, jointOffset, 0, "inch"));
            panel = jscut.geometry.difference(panel, jscut.geometry.translate(bottomNutJoint, boxWidth - jointOffset, 0, "inch"));
            panel = jscut.geometry.difference(panel, jscut.geometry.translate(rightNutJoint, boxWidth, jointOffset, "inch"));
            panel = jscut.geometry.difference(panel, jscut.geometry.translate(rightNutJoint, boxWidth, boxHeight - jointOffset, "inch"));
            panel = jscut.geometry.difference(panel, jscut.geometry.translate(topNutJoint, jointOffset, boxHeight, "inch"));
            panel = jscut.geometry.difference(panel, jscut.geometry.translate(topNutJoint, boxWidth - jointOffset, boxHeight, "inch"));

            this.operation.units = this.material.units;
            this.operation.cutDepth = this.material.thickness;
            this.operation.geometries = [panel];

            jscut.svg.clear(this.$.svg);
            jscut.svg.addGeometryToSvg(localStorage, jscut.geometry.createRect(
                -diameter, -diameter, boxWidth + diameter, boxHeight + diameter, "inch"), 90, { fill: 'white' });
            jscut.svg.addGeometryToSvg(localStorage['svg_file'], panel, 90, { fill: 'blue' });
        },

        generate: function () {
            var camPaths = jscut.cam.getCamPaths(this.operation, this.tool);
            jscut.svg.addCamPathsToSvg(localStorage['svg_file'], camPaths, 90, { fill: 'none', stroke: 'red' });

            var gcodeOptions = {units: this.units};
            var gcode = jscut.cam.getGcodeHeader(this.tool, this.material, gcodeOptions);
            gcode += jscut.cam.getOperationGcode(0, this.operation, this.tool, this.material, gcodeOptions, camPaths);

            this.simulateCutterDiameter = jscut.data.fromInch(jscut.data.toInch(this.tool.diameter, this.tool.units), this.units);
            this.simulateCutterHeight = jscut.data.fromInch(1, this.units);
            this.gcode = gcode;
        },
    });
})


function myFunction(input) {
    let req = globalstuff;
    globalstuff = JSON.parse(req);
    var result = globalstuff[0];
    console.log(result.name);
    console.log(globalstuff[0]);
    console.log(input);
    handleFiles(input.files[0]);
    // element.setAttribute('download', toGo);

}

function download(filename) {

    let element = document.createElement('a');
    element.setAttribute('href', "data:image/svg+xml;," + Potrace.getSVG(1));
    // console.log(Potrace.getSVG(1));

    globalstuff[0] = JSON.stringify([{
        "name": "asd",
        "data": Potrace.getSVG(1)
    }]);
    let req = globalstuff;
    globalstuff = JSON.parse(req);
     result = globalstuff[0];
    console.log(result.data);
    console.log(globalstuff);
    ///objectToGcode obj = new objectToGcode(result.name, result.data);
    //console.log(obj);

    // element.setAttribute('download', result.value + ".svg");
//element.setAttribute('download', filename + ".svg")
    element.style.display = 'none';
    document.body.appendChild(element);
    
localStorage['svg_file'] = Potrace.getSVG(1);
    var myVar = localStorage[globalstuff[0].name];
    console.log(result.data);
    console.log(myVar);
    
    document.body.removeChild(element);
    console.log(result.data + "");
    window.open("gcodestuff.html");

}

function handleFiles(file, name) {
    Potrace.loadImageFromFile(file);
    Potrace.process(function () {
        download(name);
    });
}
