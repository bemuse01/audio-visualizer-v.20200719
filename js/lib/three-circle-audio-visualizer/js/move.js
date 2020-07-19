const move = {
    moveCircleVertices(group, param, dataArray, direction, relocated){
        /* let offset = param.sample.parameters.radius */
        let vertices = param.sample.vertices.slice(1, param.sample.vertices.length)
        for(let i = 0; i < group.array.length / 3; i++){
            let div = i % vertices.length
            group.array[i * 3] = vertices[div].x + vertices[div].x * (dataArray[relocated[div]] / 255) * param.boost * direction
            group.array[i * 3 + 1] = vertices[div].y + vertices[div].y * (dataArray[relocated[div]] / 255) * param.boost * direction
            group.array[i * 3 + 2] = vertices[div].z + vertices[div].z * (dataArray[relocated[div]] / 255) * param.boost * direction
            /* group.array[i * 3] = vertices[div].x * (dataArray[relocated[div]] / 255) * param.boost * direction
            group.array[i * 3 + 1] = vertices[div].y * (dataArray[relocated[div]]  / 255) * param.boost * direction
            group.array[i * 3 + 2] = vertices[div].z * (dataArray[relocated[div]] / 255) * param.boost * direction */
        }
        group.needsUpdate = true
    }
}