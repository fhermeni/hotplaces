function removeDisplay() {
    gOld.transition().duration(300).remove().each("end", function() {
        svg.style("shape-rendering", null);
        transitioning = false;
    });
}

window.onresize = function(e) {

    if (window.innerWidth > 800) {
        width = window.innerWidth - margin.left - margin.right;
        height = window.innerHeight * 0.8 - margin.top - margin.bottom;
        x = d3.scale.linear()
                .domain([0, width])
                .range([0, width]);
        y = d3.scale.linear()
                .domain([0, height])
                .range([0, height]);
        pas=1;
        pad= 4;
        var svgTag = document.getElementById('svg');
        svgTag.setAttribute("width", window.innerWidth);
        svgTag.setAttribute("height", window.innerHeight * 0.8);
        treemap.ratio(height / width * 0.5 * (1 + Math.sqrt(5)));
        removeDisplay();
        initialize(currentRoot);
        //accumulate(currentRoot);
        layout(currentRoot);
        display(currentRoot);

    }



};


function getUnit(number) {
    var unit = 0;
    while(number >= 1024 && unit < 3) {
        number /= 1024;
        unit++;
    }
    number = Math.floor(number);
    var number_unit = "MB";
    if(unit === 1) number_unit = "GB";
    if(unit === 2) number_unit = "TB";
    if(unit === 3) number_unit = "PB";
    
    return [number, number_unit];
}

/*function:
 ** parameter: current hovered node
 ** description: display informations of on the hovered element (d)
 */
function displayAllInfos(d) {
    var str = "";
    
    tabNodes = d.id.split(".");
    var tmp = d.depth === 4? d.parent : d;

    str += "<table class='nodeInfo'><tr>" + 
            "<td width='65%'>Node Name</td><td>RAM</td><td>CPUs</td><td width=15%>Disk</td></tr><tr><td>";
    str += tmp.id;
    var ram = getUnit(tmp.rRAM? tmp.RAM *tmp.rRAM  : tmp.RAM);
    var cpu = tmp.rCPU? tmp.CPU * tmp.rCPU  : tmp.CPU;
    var ds = getUnit(tmp.rDiskSpace? tmp.DiskSpace * tmp.rDiskSpace : tmp.DiskSpace);
    
    str += "</td><td>" + ram[0] + ram[1]
        + "</td><td>" + cpu
        + "</td><td>" + ds[0] + ds[1]
    + "</td></tr></table>";

    if(d.depth === 4) {
        str += "<table class='VMInfo'><tr><td width=60%>VM UUID</td><td width=15%>RAM</td><td>CPUs</td><td width=15%>Disk</td></tr><tr><td>";
        ram = getUnit(d.RAM);
        ds = getUnit(d.DiskSpace);
        
        if(d.name === "free") str += "Free Space";
        else str += d.name;
        
        str += "</td><td>" + ram[0] + ram[1]
            + "</td><td>" + d.CPU
            + "</td><td>" + ds[0] + ds[1]
        + "</td></tr></table></div>";
    }
    document.getElementById("information").innerHTML = str;

}

/*function
 **description: displays infos on the currentRoot
 */
function displayInfo(d) {
    document.getElementById("information").innerHTML = "";
    var cRootId;
    if (currentRoot.id.length === 1) {
        cRootId = [currentRoot.id];
    } else {
        cRootId = currentRoot.id.split(".");
    }

    var str = "";
    var tmp = d.depth === 4 ? d.parent : d;
    var table = document.createElement("table");
    table.setAttribute("class", "nodeInfo2");
    var tr = document.createElement("tr");

    str += '<td width="65%">Node Name</td>';
    
    // if current node is a server
    if (currentRoot.depth === 3) {
        table.setAttribute("class", "nodeInfo");
        str += "<td>RAM</td><td>CPUs</td><td width=15%>Disk</td>";
    }

    tr.innerHTML = str;
    table.appendChild(tr);

    tr = document.createElement("tr");
    td = document.createElement("td");
    cRootId.forEach(function(name) {
        var span = document.createElement("span");
        span.setAttribute("class", "nodeLink");
        span.innerHTML = name;
        td.appendChild(span);
        if (name !== cRootId[cRootId.length - 1])
            td.innerHTML += ".";
    });

    tr.appendChild(td);

    if (currentRoot.depth === 3) {
        var ram = getUnit(tmp.rRAM ? tmp.RAM * tmp.rRAM : tmp.RAM);
        var cpu = tmp.rCPU ? tmp.CPU * tmp.rCPU : tmp.CPU;
        var ds = getUnit(tmp.rDiskSpace ? tmp.DiskSpace * tmp.rDiskSpace : tmp.DiskSpace);

        td = document.createElement("td");
        td.innerHTML = ram[0] + ram[1];
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = cpu;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerHTML = ds[0] + ds[1];
        tr.appendChild(td);
    }

    table.appendChild(tr);
    document.getElementById("information").appendChild(table);

    var nodelist = document.getElementsByClassName("nodeLink");
    var path = Array();
    var tmpnode = inaltered_Root;

    for (var i = 0; i < nodelist.length - 1; i++) {

        if (tmpnode.name !== nodelist[i].innerHTML) {
            for (var j = 0; j < tmpnode.children.length; j++) {
                if (tmpnode.children[j].name === nodelist[i].innerHTML) {
                    tmpnode = tmpnode.children[j];
                }
            }
        }
        path.push(tmpnode);


        nodelist[i].onclick = function() {
            search(this.innerHTML);
        };
        /*
         nodelist[i].onmouseover = function() {
         console.log("over");
         };
         */
    }
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
                for (var j = 1; j < current.childNodes.length; j++) {
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
            for (var j = 1; j < current.childNodes.length; j++) {



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
