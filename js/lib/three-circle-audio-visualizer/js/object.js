const object = {
    createCircle(scene, group, sample){
        let geometry = sample.clone()
        let material = new THREE.LineBasicMaterial({
            color: 0x47d2ff,
            transparent: true,
            opacity: 1.0
        })
        let mesh = new THREE.Line(geometry, material)
        group.add(mesh)
        scene.add(group)
    },
    createLine(scene, group, circle){
        let first = circle.first.children[0].geometry.vertices
        let second = circle.second.children[0].geometry.vertices
        let vertices = first.slice(0, first.length - 1).length

        for(let i = 0; i < vertices; i++){
            let geometry = new THREE.Geometry()
            geometry.vertices.push(new THREE.Vector3(first[i].x, first[i].y, first[i].z))
            geometry.vertices.push(new THREE.Vector3(second[i].x, second[i].y, second[i].z))
            
            let material = new THREE.LineBasicMaterial({
                color: 0x47d2ff,
                transparent: true,
                opacity: 0.25
            })
            let mesh = new THREE.Line(geometry, material)
            group.add(mesh)
        }

        scene.add(group)
    },
    relocateDataArray(param, dataArray){
        let index = [], arr = []
        let offset = 16
        
        for(let i = 0; i < dataArray.length; i++) index[i] = i
        
        let left = index.slice(0 + offset * 2, index.length / 2), right = index.slice(index.length / 2, index.length - offset * 10)
        
        for(let i = 0; i < (param.sample.vertices.length - 1) / 2; i++){
            if(i % 2 === 0) arr[i] = left[Math.floor(i / 2)]
            else arr[i] = right[right.length - 1 - Math.floor(i / 2)]
        }

        console.log(arr.concat(arr))
        return arr.concat(arr)
    },
    reworkSample(param){
        let clone = param.sample.clone()
        let geometry = new THREE.Geometry()
        clone.vertices.forEach((e, i) => {
            if(i !== 0) geometry.vertices.push(new THREE.Vector3(e.x, e.y, e.z))
            if(i === clone.vertices.length - 1) geometry.vertices.push(new THREE.Vector3(clone.vertices[1].x, clone.vertices[1].y, clone.vertices[1].z))
        })
        return geometry 
    }
}