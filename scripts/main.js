/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// Spark AR Studio extension for VS Code - https://fb.me/spark-vscode-plugin
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

const Scene = require("Scene");
const Reactive = require("Reactive");
const Diagnostics = require("Diagnostics");
const Materials = require("Materials");

function checkCollision(positionA, positionB, lengthA, lengthB) {
    return Reactive.abs(positionA.sub(positionB)).le(Reactive.add(lengthA.div(2), lengthB.div(2)));
}
 
function checkCollision3D(entityA, entityB) {
    return Reactive.andList([
        checkCollision(entityA.sceneObject.transform.x, entityB.sceneObject.transform.x, entityA.size.x, entityB.size.x),
        checkCollision(entityA.sceneObject.transform.y, entityB.sceneObject.transform.y, entityA.size.y, entityB.size.y),
        checkCollision(entityA.sceneObject.transform.z, entityB.sceneObject.transform.z, entityA.size.z, entityB.size.z)
    ]);
}
 
class Entity {
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }
 
    async create() {
        this.sceneObject = await Scene.root.findFirst(this.name);
        return this;
    }
}
 
(async () => {
    const plane0 = await new Entity("plane0", Reactive.point(0.1, 0.1, 0.1)).create();
    const plane1 = await new Entity("plane1", Reactive.point(0.1, 0.1, 0.1)).create();
    const plane2 = await new Entity("plane2", Reactive.point(0.1, 0.1, 0.1)).create();
 
    const material0 = await Materials.findFirst("material0");
    const material1 = await Materials.findFirst("material1");
    const material2 = await Materials.findFirst("material2");

    checkCollision3D(plane0, plane1).onOn().subscribe(() => {
      plane1.sceneObject.material = material1;
    });
    checkCollision3D(plane0, plane1).onOff().subscribe(() => {
      plane1.sceneObject.material = material0;
    });


    checkCollision3D(plane0, plane2).onOn().subscribe(() => {
      plane2.sceneObject.material = material2;
    });
    checkCollision3D(plane0, plane2).onOff().subscribe(() => {
      plane2.sceneObject.material = material0;
    });

})();