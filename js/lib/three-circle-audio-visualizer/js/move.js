const move = {
    moveCircleVertices(arr, param, dataArray, direction, relocated, sample){
        let vertices = sample.vertices, last = vertices.length - 1
        arr.vertices.forEach((e, i) => {
            let index = i === last ? 0 : i
            e.x = vertices[i].x + vertices[i].x * (dataArray[relocated[index]] / 255) * param.boost * direction 
            e.y = vertices[i].y + vertices[i].y * (dataArray[relocated[index]] / 255) * param.boost * direction 
            e.z = vertices[i].z + vertices[i].z * (dataArray[relocated[index]] / 255) * param.boost * direction 
        })
        arr.verticesNeedUpdate = true
    },
    moveLineVertices(arr, first, second){
        arr.children.forEach((e, i) => {
            e.geometry.vertices[0].x = first[i].x
            e.geometry.vertices[0].y = first[i].y
            e.geometry.vertices[0].z = first[i].z

            e.geometry.vertices[1].x = second[i].x
            e.geometry.vertices[1].y = second[i].y
            e.geometry.vertices[1].z = second[i].z

            e.geometry.verticesNeedUpdate = true
        })
    },
    rotateParticle(group, param){
        group.forEach(e => {
            e.children[0].rotation.x += param.rotation
            e.children[0].rotation.y += param.rotation

            e.children[1].rotation.x += param.rotation
            e.children[1].rotation.y += param.rotation
        })
    },
    updateMixer(mixer, delta, param){
        mixer.mix.forEach(e => {
            e.update(delta * param.boost)
        })
    }
}