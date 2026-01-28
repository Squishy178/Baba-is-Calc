function parseLevel(level){
    let output = "";
    output.push('{\n"name:":"Untitled",\nentities:[')
    for (L of level){
        output.push('{\n"obj":'+L.getObject()+',\n');
        output.push('"pos":['+L.p.x+','+L.p.y+'],\n');
        output.push('"facing":"'+L.facing+'"\n}');
        
        if (L != level[level.length-1]) output.push(',\n');
        
    }

    output.push('],\n"generators":{\n"lines":[],\n"boxes":[],\n"rects":[],\n"sentences":[]\n}\n}');
    return output;
}