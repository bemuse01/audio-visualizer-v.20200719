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
    createParticle(scene, group, param, radian){
        let x = param.particle.dist / 2, y = Math.sqrt(param.particle.dist ** 2 - x ** 2) / 2
        for(let i = 0; i < param.particle.length; i++){
            let vertices = param.circle.sample.vertices
            let random = Math.floor(Math.random() * (vertices.length - 1) + 1)
            let scale = Math.random() * (1 - param.particle.scale) + param.particle.scale
            let rot = {x: Math.random() * 180 * radian, y: Math.random() * 180 * radian}

            let local = new THREE.Group()

            let geometry = new THREE.Geometry()
            geometry.vertices.push(new THREE.Vector3(0, y, 0))
            geometry.vertices.push(new THREE.Vector3(-x, -y, 0))
            geometry.vertices.push(new THREE.Vector3(x, -y, 0))
            geometry.faces.push(new THREE.Face3(0, 1, 2))

            let material = {
                back: new THREE.MeshBasicMaterial({
                    color: 0x47d2ff,
                    transparent: true,
                    opacity: 0.1,
                    side: THREE.DoubleSide
                }),
                wire: new THREE.MeshBasicMaterial({
                    color: 0x47d2ff,
                    transparent: true,
                    opacity: 0.6,
                    wireframe: true
                })
            }

            let mesh = {
                back: new THREE.Mesh(geometry, material.back),
                wire: new THREE.Mesh(geometry, material.wire)
            }

            mesh.back.position.set(vertices[random].x, vertices[random].y, vertices[random].z) 
            mesh.wire.position.set(vertices[random].x, vertices[random].y, vertices[random].z)
            
            mesh.back.scale.set(scale, scale, 1)
            mesh.wire.scale.set(scale, scale, 1)
            
            mesh.back.rotation.set(rot.x, rot.y, 0)
            mesh.wire.rotation.set(rot.x, rot.y, 0)

            local.add(mesh.back)
            local.add(mesh.wire)
            group.add(local)
        }
        scene.add(group)
    },
    createParticleMixer(group, mixer, param){
        group.children.forEach((e, i) => {
            let positionArray = []
            for(let i = 0; i < param.position.length; i++){
                positionArray[i * 3] = e.children[0].position.x * param.position[i]
                positionArray[i * 3 + 1] = e.children[0].position.y * param.position[i]
                positionArray[i * 3 + 2] = e.children[0].position.z * param.position[i]
            }

            let positionTrack = new THREE.VectorKeyframeTrack('.position', [0, 1, 2, 3, 4], positionArray)
            let opacityTrack = [
                new THREE.NumberKeyframeTrack('.material.opacity', [0, 1, 2, 3, 4], param.opacity.back),
                new THREE.NumberKeyframeTrack('.material.opacity', [0, 1, 2, 3, 4], param.opacity.wire)
            ]
            let clip = [
                new THREE.AnimationClip('back', 4, [positionTrack, opacityTrack[0]]),
                new THREE.AnimationClip('wire', 4, [positionTrack, opacityTrack[1]])
            ]

            mixer.back.mix[i] = new THREE.AnimationMixer(e.children[0])
            mixer.wire.mix[i] = new THREE.AnimationMixer(e.children[1])
            
            mixer.back.clip[i] = mixer.back.mix[i].clipAction(clip[0])
            mixer.wire.clip[i] = mixer.wire.mix[i].clipAction(clip[1])

            mixer.back.clip[i].startAt(param.delay * i).play()
            mixer.wire.clip[i].startAt(param.delay * i).play()
        })
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
    },
    disposeCircle(scene, group){
        for(let i in group){
            let object = scene.getObjectByProperty('uuid', group[i].uuid)
            scene.remove(object)
            object.children[0].geometry.dispose()
            object.children[0].material.dispose()
            object.children.length = 0            
        }
    },
    disposeLine(scene, group){
        let object = scene.getObjectByProperty('uuid', group.uuid)
        scene.remove(object)
        object.children.forEach(e => {
            e.geometry.dispose()
            e.material.dispose()
        })
        object.children.length = 0
    },
    disposeParticle(scene, group){
        let object = scene.getObjectByProperty('uuid', group.uuid)
        scene.remove(object)
        object.children.forEach(e => {
            e.children.forEach(i => {
                i.geometry.dispose()
                i.material.dispose()
            })
            e.children.length = 0
        })
        object.children.length = 0
    },
    disposeParticleMixer(mixer){
        for(let i in mixer){
            mixer[i].forEach(e => {
                e.uncacheClip(e)
            })
            mixer[i].length = 0
        }
    },
    resetMixerTime(mixer, param){
        for(let i in mixer){
            mixer[i].mix.forEach((e, i) => {
                e.time = 0
            })
            mixer[i].clip.forEach((e, i) => {
                e.stop()
                e.startAt(param.delay * i).play()
            })
        }
    }
}