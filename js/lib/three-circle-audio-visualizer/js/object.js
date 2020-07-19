const object = {
    createCircle(scene, group, param){
        let geometry = param.sample.clone()
        let edge = new THREE.EdgesGeometry(geometry)
        let material = new THREE.LineBasicMaterial({
            color: 0xff8840,
            transparent: true,
            opacity: 1.0
        })
        let mesh = new THREE.Line(edge, material)
        group.add(mesh)
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
    }
}