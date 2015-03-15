/** @file This file contains functions for reading attributes of an xml. 
*/

/** Gets a field for an object from an xml. If frame value is provided, it gives the field at the given.
  * @param {string} xml - The xml containing the annotations
  * @param {int} ind_object - Index to the object to be displayed
  * @param {string} name - name of the field to return.
  * @param {int} frame - frame of interest
*/
function LMgetObjectField(xml,ind_object, name, frame) {
	var obj = $(xml).children("annotation").children("object").eq(ind_object);
	if (obj.length == 0) return "";
	if (name == 'name' ||  name == 'attributes' || name == 'occluded'){
		if (!obj.children(name).length > 0) return "";
		else return obj.children(name).text();
	}
	if (name == 'deleted' || name == 'verified' || name == 'automatic'){
		if (!obj.children(name).length > 0) return "";
		else return parseInt(obj.children(name).text());
	}
    if (name == 'username'){
        if (obj.children("segm").length > 0 && obj.children("segm").children("username").length > 0) obj.children("segm").children("username").text();
        else if (obj.children("polygon").children("username").length > 0) return obj.children("polygon").children("username").text();
        return "";
    }
    if (name == 'parts'){
        parts = [];
        if (obj.children("parts").length>0) {
            tmp = obj.children("parts").children("hasparts").text();
            if (tmp.length>0) {
                // if it is not empty, split and trasnform to numbers
                parts = tmp.split(",");
                for (var j=0; j<parts.length; j++) {parts[j] = parseInt(parts[j], 10);}
            }
        }
        return parts;
    }
	if (name == 'x' || name == 'y'){
		if (frame){
			var framestamps = (obj.children("polygon").children("t").text()).split(',')
          	for(var ti=0; ti<framestamps.length; ti++) { framestamps[ti] = parseInt(framestamps[ti], 10); } 
          	var objectind = framestamps.indexOf(frame);
            if (objectind == -1) return null;
			var coords = ((obj.children("polygon").children(name).text()).split(';')[objectind]).split(',');
			for(var ti=0; ti<coords.length; ti++) { coords[ti] = parseInt(coords[ti], 10); }
			return coords;	

		}
		else {
			var pt_elts = obj.children("polygon")[0].getElementsByTagName("pt");
			if (pt_elts){
				var coord = Array(pt_elts.length);
				for (var ii=0; ii < coord.length; ii++){

					coord[ii] = parseInt(pt_elts[ii].getElementsByTagName(name)[0].firstChild.nodeValue);
				} 
				return coord;
			}
		}
	}
	return null;


}

/** Returns number of LabelMe objects. */
function LMnumberOfObjects(xml) {
    return xml.getElementsByTagName('object').length;
}

/** Sets a field for an object from an xml. 
  * @param {string} xml - The xml containing the annotations
  * @param {int} ind_object - Index to the object to be set
  * @param {string} name - name of the field to set.
  * @param {string} value - value to which the object will be set
*/
function LMsetObjectField(xml, ind_object, name, value){
	var obj = $(xml).children("annotation").children("object").eq(ind_object);
	if (name == 'name' || name == 'automatic' || name == 'attributes' || name == 'occluded' || name == 'deleted' || name == 'id'){
		if (obj.children(name).length > 0) obj.children(name).text(value);
		else if (name != 'automatic') obj.append("<"+name+">"+value+"</"+name+">");
	}
	if (name == 'username'){
		if (obj.children("polygon").length == 0 && obj.children("segm").children("username").length == 0) obj.children("segm").append($("<username>anonymous</username>"));
		else if (obj.children("polygon").length > 0 && obj.children("polygon").children("username").length == 0) obj.children("polygon").append($("<username>anonymous</username>"));
	}
	// if (name == 'parts'){
	// 	if (obj.children("parts").length > 0){
	// 		if (!obj.children("parts").children("ispartof").length>0) {
	// 			obj.children("parts").append("<ispartof></ispartof>");
	// 		}
	// 		if (!curr_obj.children("parts").children("hasparts").length>0) {
	// 			obj.children("parts").append("<hasparts></hasparts>");
	// 		}
	// 	}
	// 	else obj.append("<parts><hasparts></hasparts><ispartof></ispartof></parts>");
	// }
	// if (name == "ispartof" || name == "hasparts"){
	// 	if (obj.children("parts").length > 0){
	// 		if (!obj.children(name).children("ispartof").length > 0) obj.children(name).append("<ispartof></ispartof>");
	// 		if (!obj.children(name).children("hasparts").length > 0) obj.children(name).append("<hasparts></hasparts>");
			

	// 	}
	// 	else {
	// 		obj.append("<parts><hasparts></hasparts><ispartof></ispartof></parts>");
	// 	}
	// }
	if (name == 'x' || name == 'y' || name == 't' || name == 'userlabeled'){
		if (obj.children("polygon").children("t").length > 0){
			obj.children("polygon").children(name).text(value);
		}
		else {
			for (var ii = 0; ii < value.length; ii++){
				obj.children("polygon").children("pt").eq(ii).children(name).text(value[ii]);
			}			   	
		}
	}

}

