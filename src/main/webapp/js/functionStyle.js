function removeDisplay() {
    gOld.transition().duration(300).remove().each("end", function() {
        svg.style("shape-rendering", null);
        transitioning = false;
    });
}


function search_Node(UUID, d){
	
	if(d.UUID===UUID){
		return d
	}
	
		if(d.children){
			for (var i in d.children){
				var tmp= search_Node(UUID, d.children[i])
				if (tmp != null){
					return tmp;
				}
				
			}
			
		}
		
	}


function keybordFunction(ev){
	console.log(ev.keyCode);
	if (ev.keyCode === 32){
		 if($("#"+hoverNode.UUID).length ===0){
		 	
		 	creatContainerInfo(hoverNode.UUID, hoverNode.name, ToStringInfo(getInfo(hoverNode)), '20%', '50%', hoverNode.type);
		 	
		 	
		 }
		 else{
		 	$("#"+hoverNode.UUID).containerize("restorePopup"); 
			 
		 }
	}
	if(ev.keyCode === 102 ||ev.keyCode === 70){
			
			if($("#search_form").get(0).isClosed){
				 $("#search_form").containerize("open",200), $("#search_form").containerize("setSize", $("#search_form").css("width"), 300)
				 }
			else{ $("#search_form").containerize("close",0)}
		}
	if(ev.keyCode === 104 ||ev.keyCode === 72){
			
			if($("#help").get(0).isClosed){
				 $("#help").containerize("open",200);
				 }
			else{ $("#help").containerize("close",0)}
	}
	if(ev.keyCode === 99 ||ev.keyCode === 67){
			containerConstraints("constraintsContainer","20%", "20%")
				}

}

/*window.onresize = function(e) {

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




}*/

/*function:
 ** parameter: UUID of node
 ** description: stop blinking animation of node with UUID passed in parameter
 */

function stopAnimation(UUID){
	var el = document.getElementsByName(UUID);
	console.log(el)
	for (var i = 0; i < el.length; i++){
		
	}
	
	}

/*function:
 ** parameter: UUID of node
 ** description: start blinking animation of node with UUID passed in parameter
 */

function startAnimation(UUID){

	
	var el = document.getElementsByName(UUID);
	if (el.length ===0){
		d= search_Node(UUID, inaltered_Root)
	}
	while(el.length ===0 && d.parent ){
			d= d.parent
		
		 el = document.getElementsByName(d.UUID);
		 }
		
	
	
	
	for (var i = 0; i < el.length; i++){
	
		if(el[i].tagName==="rect"){
			var animation = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
		    animation.setAttributeNS(null, 'attributeName', 'fill');
		    animation.setAttributeNS(null, 'begin', 'indefinite');
		    animation.setAttributeNS(null, 'from', el[i].getAttribute("data-color"));
		    var color =el[i].getAttribute("data-color");
			color = hexToRgb(color);
			color.r -= 50;
			color.g -= 50;
			color.b -= 50;
			color= "rgb(" + color.r + "," + color.g + "," + color.b + ")"    
			animation.setAttributeNS(null, 'to', color);
		    animation.setAttributeNS(null, 'dur', 1);
		    animation.setAttributeNS(null, 'calcMode', "discrete");
		    animation.setAttributeNS(null, 'fill', 'freeze');
			animation.setAttribute("repeatCount", "indefinite");
			el[i].appendChild(animation);
			animation.beginElement();
	}
	}
	}

function startAnimationStroke(UUID){

	
	var el = document.getElementsByName(UUID);
	if (el.length ===0){
		d= search_Node(UUID, inaltered_Root)
	}
	while(el.length ===0 && d.parent ){
			d= d.parent
		
		 el = document.getElementsByName(d.UUID);
		 }
		
	
	
	
	
	for (var i = 0; i < el.length; i++){
	
		if(el[i].tagName==="rect"){
			var animation = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
		    animation.setAttributeNS(null, 'attributeName', 'stroke');
		    animation.setAttributeNS(null, 'begin', 'indefinite');
		    animation.setAttributeNS(null, 'from', el[i].getAttribute("data-color"));
   
			animation.setAttributeNS(null, 'to', colorProb);
		    animation.setAttributeNS(null, 'dur', 1);
		    animation.setAttributeNS(null, 'calcMode', "discrete");
		    animation.setAttributeNS(null, 'fill', 'freeze');
			animation.setAttribute("repeatCount", "indefinite");
			el[i].appendChild(animation);
			animation.beginElement();
	}
	}
	}

/*function:
 ** parameter: 
 ** description: toString method to constraints list.
 ** creat html list of constraints
 */

function constraintsToString(list){
	var cList = list;
	cList.sort(function(a, b){
		if(a.satisfied > b.satisfied){
			return 1;
		}
		else if (a.satisfied < b.satisfied){
			return -1;
		}
		else{
			var A = a.id.toLowerCase();
			var B = b.id.toLowerCase();
			if (A < B){
	        	return -1;
	        }else if (A > B){
		        return  1;
		        }else{
		        	return 0;
		        	}
		}
	     
});
	
	
	var result= "";
	
	cList.forEach(function(el){
		var color =  el.satisfied?'black' : colorProb;
		result+= "<p  style= color:" + color +";> " + el.id +"("
		if(el.VMs && el.VMs.length ===1 ){
			result+= "[<span class ='constraintsList'data =" + el.VMs[0].VMs +" >" +el.VMs[0].VMs.length + " VMs</span>]"
		} 
		if(el.VMs && el.VMs.length >1 ){
			for(var i =0; i <el.VMs.length; i ++){
				if(i ===0){
					result+= "[[<span class ='constraintsList'data =" + el.VMs[i].VMs + ">"+el.VMs[i].VMs.length + " VMs</span>]"
					
				}
				else{result+= ", [<span class ='constraintsList'data =" + el.VMs[i].VMs + ">"+el.VMs[i].VMs.length + " VMs</span>]"
					
				}
				if(i===el.VMs.length-1){
					result += "]"
				}
			}
		} 
		if(el.Nodes && el.VMs){
			result += ", "
		}
		if(el.Nodes && el.Nodes.length ===1){
			result+= "[<span class ='constraintsList'data =" + el.Nodes[0].Nodes + ">"+ el.Nodes[0].Nodes.length + " Nodes</span>]"
		} 
		
		if(el.Nodes && el.Nodes.length >1 ){
			for(var i =0; i <el.Nodes.length; i ++){
				if(i ===0){
					result+= "[[<span class ='constraintsList'data =" + el.Nodes[i].Nodes + ">"+el.Nodes[i].Nodes.length + " Nodes</span>]"
					
				}
				else{result+= ", [<span class ='constraintsList'data =" + el.Nodes[i].Nodes + ">"+el.Nodes[i].Nodes.length + " Nodes</span>]"
					
				}
				if(i===el.Nodes.length-1){
					result += "]"
				}
			}
		} 
		
		if(el.rcid){
			result += ", rcId: <span class ='constraintsResources'>" + el.rcid +"</span>"
			}
		if(el.ratio){
			result += ", ratio: " + el.ratio 
		}
		if(el.amount){
			result += ", amount: " + el.amount 
		}
		result+=")</p>"
		
	})
	return result;
}


function constraintToString(c){
	var result= "";
	
		result+= "<p> " + c.id +"( "
		if(c.VMs && c.VMs.length ===1 ){
			result+= "[<span class ='constraintsList'data =" + c.VMs[0].VMs + ">" +c.VMs[0].VMs.length + " VMs</span>] "
		} 
		if(c.VMs && c.VMs.length >1 ){
			for(var i =0; i <c.VMs.length; i ++){
				if(i ===0){
					result+= "[[<span class ='constraintsList'data =" + c.VMs[i].VMs + ">"+c.VMs[i].VMs.length + " VMs</span>]"
					
				}
				else{result+= ", [<span class ='constraintsList'data =" + c.VMs[i].VMs + ">"+c.VMs[i].VMs.length + " VMs</span>]"
					
				}
				if(i===c.VMs.length-1){
					result += "]"
				}
			}
		} 
		if(c.Nodes && c.VMs){
			result += ", "
		}
		if(c.Nodes && c.Nodes.length ===1){
			result+= "[<span class ='constraintsList'data =" + c.Nodes[0].Nodes + ">"+ c.Nodes[0].Nodes.length + " Nodes</span>] "
		} 
		
		if(c.Nodes && c.Nodes.length >1 ){
			for(var i =0; i <c.Nodes.length; i ++){
				if(i ===0){
					result+= "[[<span class ='constraintsList'data =" + c.Nodes[i].Nodes + ">"+c.Nodes[i].Nodes.length + " Nodes</span>]"
					
				}
				else{result+= ", [<span class ='constraintsList'data =" + c.Nodes[i].Nodes + ">"+c.Nodes[i].Nodes.length + " Nodes</span>]"
					
				}
				if(i===c.Nodes.length-1){
					result += "]"
				}
			}
		} 
		if(c.rcid){
			result += ", rcId: <span class ='constraintsResources'>" + el.rcid +"</span>"
			}
		if(c.ratio){
			result += ", ratio: " + c.ratio 
		}
		if(c.amount){
			result += ", amount: " + c.amount 
		}
		result+=")</p><br>"
		
	return result;
}

/*function:
 ** parameter: node
 ** description: get all information of node d
 **return: information list (Array object)
 */

function getInfo(d){
	
	var info = Array();
	info.push(d.parent? d.parent.id : "")
	info.push(!isVM(d)? (d.children[d.children.length-1].name==="free"? d.children.length-1:d.children.length ): 0);
	info.push( d);

	info.push(d.type);
	if(d.type==="vm" || d.type === "node" || d.type ==="free"){
	
		info.push(d.resources);
	}
	
		info.push(d.ratio);
	
	info.push(d.Constraints);
	
	return info;
	}

/*function:
 ** parameter: (Array object) with node's information (take with getinfo())
 ** description: creat an html string with node's information
 */
	
function ToStringInfo(list){
	console.log(list);
	var result="Position: ";
	var tmp = list[0].split(".");
	tmp.forEach(function(el){
		if(el==="g5k"){
			result+= "<span class = 'nodeLink'>"+el+ "</span>"
		}
		else{
		result+= ".<span class = 'nodeLink'>" +el+ "</span>"
		}
	
	}
	);
	result = "<p id='parentLink'>" + result +"</p> <br/> "
	result +=  (list[1]!=0? ("<span class='nodeNumb' name='nodeNumb' >numbers of "+ (list[2].children? (list[2].children[0].type==="vm"? "VMs" : (list[2].children[0].type==="node"? "Nodes": (list[2].children[0].type+"s") )): "children") +": " + list[1] +" </span> <br/>" ): "") 
	result+= " <ul></ul> <br/>";
	
	if(list[4]){
		if(list[3]=== "vm"){result += "<p> Virtual resources : <br/> <ul> "}
		
		
		
		else{ if(list[3]==="node"){result += "<p> Resources physical/virtual/ratio : <br/> <ul> " }}
	

				for(var r in list[4]){
			var num= list[4][r];
			var res;
			


			
			
				
					var ratio = list[5]&&list[5][r]? list[5][r].toFixed(2) : 1
					list[3]==="node"? (res = ""+ getUnit(num)[0]+ getUnit(num)[1] +" / "  + getUnit(num* ratio)[0]+ getUnit(num* ratio)[1] + " / " + ratio):
									(list[3]==="vm"? (res = ""+getUnit(num*1)[0] + getUnit(num*1)[1]) : null)
			
					
			
			 
				
				
				
				result+= "<li>" + r+ ": " + res  +"</li>"
			
		} 
		result+= "</ul></p><br/>"
	}
	
	if(list[6]){
		result += "<p> Constraints : <br/> <ul> "
		var res="";
		for(var c in list[6]){
				res += list[6][c].satisfied? ("<li class='constraintsNode' data="+ list[6][c].name  +">"+ list[6][c].type +"</li>") :("<li class='constraintsNode' data="+ list[6][c].name  +" style= color:" + colorProb +";>"+ list[6][c].type +"</li>");
				}
		result+= res +"</ul></p><br/>" ;
	}
	
	return result;
	
}

/*function:
 ** parameter: list of node and html list element
 ** description: display node passed in parameter into html list element
 */


 function displayChildren(childlist, ul){
	 if(childlist){
 	childlist.forEach(function(el) {
 		if(el.name!="free"){
 	 var li = document.createElement("li");
 	 li.innerHTML=el.name;
 	 li.setAttribute("class", "childLink");
 	 ul.appendChild(li);
 	 
 	 li.onclick= function(){
	 	 search(this.innerHTML);
 	 }
 	 }
 	 });
 	 }
 	 
 }
 
 
/*function:
 ** parameter: number
 ** description: convert number with MB unit in number with a appropriat unit
 */

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

    str += tmp.id;
    var ram = getUnit(tmp.rRAM? tmp.RAM *tmp.rRAM  : tmp.RAM);
    var cpu = tmp.rCPU? tmp.CPU * tmp.rCPU  : tmp.CPU;
    var ds = getUnit(tmp.rDiskSpace? tmp.DiskSpace * tmp.rDiskSpace : tmp.DiskSpace);
    



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


    str += '<td width="65%">Node Name</td>';
    


    cRootId.forEach(function(name) {
        var span = document.createElement("span");
        
        span.innerHTML = name;
        if (name !== cRootId[cRootId.length - 1])
            span.setAttribute("class", "nodeLink");
            document.getElementById("information").appendChild(span);
        if (name !== cRootId[cRootId.length - 1]) {
            document.getElementById("information").innerHTML += ".";
        }
    });


    // add on  click events
    var nodelist = document.getElementsByClassName("nodeLink");
    var path = Array();
    var tmpnode = inaltered_Root;

    for (var i = 0; i < nodelist.length; i++) {

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
                        current.childNodes[j].style.fill = current.childNodes[j].getAttribute("data-color");
                    
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


                var color = current.childNodes[j].getAttribute("data-color");
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
