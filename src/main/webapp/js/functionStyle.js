window.onresize = function (e) {
	if(window.innerWidth>800){
	width = window.innerWidth - margin.left - margin.right;
    height =  window.innerHeight*0.8 - margin.top - margin.bottom;
    var svgTag= document.getElementById('svg');
	svgTag.setAttribute("width", window.innerWidth);
	svgTag.setAttribute("height", window.innerWidth/2);
	treemap.ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
	gOld.transition().duration(300).remove().each("end", function() {
                svg.style("shape-rendering", null);
                transitioning = false;
            });
	initialize(currentRoot);
	//accumulate(currentRoot);
    layout(currentRoot);
    display(currentRoot);
    
    }

	
	
	}


/*function:
 ** parameter: current hovered node
 ** description: display informations of on the hovered element (d)*/
function contextualMenu(d) {
    var tmp = d;
    var str = "";
    var names = Array();
    var depth = 0;

    while (tmp.parent != null) {
        names.push('<span class="nodeLvl' + depth + '">' + tmp.name + '</span>');
        tmp = tmp.parent;
        depth++;
    }
    names.reverse();
    str = names.join(".");
    pop(str);
}


function position() {
    this.style("left", function(d) {
        return d.x + "px";
    })
            .style("top", function(d) {
        return d.y + "px";
    })
            .style("width", function(d) {
        return Math.max(0, d.dx - 1) + "px";
    })
            .style("height", function(d) {
        return Math.max(0, d.dy - 1) + "px";
    });
}

/*function: 
 **parameter: current node
 **description: return complet name of node (like "g5K.Bordeaux.borderline.bordeline-2") */
function getId(d) {

    var name = "";
    var node = d;
    while (node.parent) {
        if (name == "") {
            name = node.name;
            node = node.parent;

        }
        else {
            name = node.name + "." + name;
            node = node.parent;
        }
    }
    return name = node.name + "." + name;

}

/*function:
 **parameter: current DOM hovered element
 **description:  change color on current hovered element and restor color on old hovered element 
 ** return: string
 */
function onHover(div) {

    unHighLight(div);
    highLight(div);


}

/*function
 **parameter : current Dom hovered element
 **description: restore color on last hovered element if it's different from new hovered element
 */
function unHighLight(div) {

    //test: the hovered element has change 
    if (memEletSelect != div && memEletSelect != undefined) {
        var listChildNode = memEletSelect ? memEletSelect.childNodes : null;
        if (listChildNode != null) {
            for (var i = 1; i < (listChildNode.length - 1) / 2; i++) {
	            var current = listChildNode[i];
	            for(var j = 1; j < current.childNodes.length; j++){
                //in safari and chrome
                var color = current.childNodes[j].style.fill;
                if (color[0] === "#") {
                    color = hexToRgb(color);
                    color.r += 50;
                    color.g += 50;
                    color.b += 50;
                    current.childNodes[j].style.fill = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                }
                //in opera and firefox
                if (color[0] === "r") {
                    color = color.split(",");
                    var r = parseInt(color[0].slice(4)) + 50;
                    var g = parseInt(color[1]) + 50;
                    var b = parseInt(color[2].slice(0, color[2].length - 1)) + 50;
                    current.childNodes[j].style.fill = "rgb(" + r + "," + g + "," + b + ")";


                }
            }
            }
            memEletSelect.style.border = "";
            memEletSelect.style.backgroundColor = "";
        }


        memEletSelect = undefined;



    }
}
/*function
 **parameter : current Dom hovered element
 **description: color on new hovered element if it's different from last hovered element
 */
function highLight(div) {

	
    if (memEletSelect === undefined && div.getAttribute("id") != "g5k.") {
        for (var i = 1; i < (div.childNodes.length - 1) / 2; i++) {
            //in safari and chrome
            var current = div.childNodes[i];
            for(var j = 1; j < current.childNodes.length; j++ ){
	            
            
            var color = current.childNodes[j].style.fill;
            if (color[0] === "#") {
                color = hexToRgb(color);
                color.r -= 50;
                color.g -= 50;
                color.b -= 50;
                current.childNodes[j].style.fill = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                }
            
            //in opera and firefox
            if (color[0] === "r") {
                color = color.split(",");
                var r = parseInt(color[0].slice(4)) - 50;
                var g = parseInt(color[1]) - 50;
                var b = parseInt(color[2].slice(0, color[2].length - 1)) - 50;
                current.childNodes[j].style.fill = "rgb(" + r + "," + g + "," + b + ")";


            }
        }
        }

        div.style.border = " solid 1px rgb(230,230,230)";
        div.style.backgroundColor = "rgb(230,230,230)";
        memEletSelect = div;
    }
}



/*function
 **parameter: message to display
 **description: add the message in the div tag named "information"
 */
function pop(message) {
    document.getElementById("information").innerHTML = message;

}

/*function
 **description: remove the message in the div tag named "information"
 */
function remove() {
    document.getElementById("information").innerHTML = '';
}

/*function
 **parameter: hex color
 **description: convert  an hex color to an RGB color "
 ** return: RGB color
 */

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


/*function
 **parameter: elt: dom element, d: current node 
 **description: compute size of  current node label depending on the size of dom element
 **return: correct size for current node label
 */
function textResize(elt, d) {

    var textWidth = elt.getComputedTextLength();
    var arrayBro = elt.parentNode.childNodes;
    var len = arrayBro.length;
    var i = len / 2;

    if (arrayBro[i].firstChild === null || elt.firstChild === null)
        return null;

    while (arrayBro[i].firstChild.nodeValue !== elt.firstChild.nodeValue) {
        i++;
    }

    var irect = i - len / 2;
    var rectWidth = parseInt(elt.parentNode.childNodes[irect].getAttribute('width'));

    return textWidth < rectWidth ? null : rectWidth * 2;
}