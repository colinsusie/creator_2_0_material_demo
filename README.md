# creator_2_0_material_demo

## 简介

使用Creator2.0的材质系统实现几个Shader，效果如下：

- 正常效果(Sprite自带)：
![效果](https://github.com/colinsusie/creator_2_0_material_demo/blob/master/snapshot/normal.jpg)

- 灰度效果（Sprite自带）：
![效果](https://github.com/colinsusie/creator_2_0_material_demo/blob/master/snapshot/gray.jpg)

- 高亮叠加效果
![效果](https://github.com/colinsusie/creator_2_0_material_demo/blob/master/snapshot/overlay.jpg)

- 雨水效果
![效果](https://github.com/colinsusie/creator_2_0_material_demo/blob/master/snapshot/rain.jpg)

## 实现概述

### 修改Sprite对材质的默认支持

Sprite默认提供了两种材质效果，就是上面的**正常效果**，和**灰度效果**，个人觉得实现得有点局限性：比如我想实现一种效果（如上面的高亮），只能通过外部强制指定材质来实现，如果Sprite换了另一张纹理，或是Sprite同时有一个Animation组件用于播放序列帧，那么Sprite内部会强制切换回正常效果。

所以，我Hook了Sprite的实现，增加自定义材质的逻辑，代码在：
[SpriteHook](https://github.com/colinsusie/creator_2_0_material_demo/blob/master/assets/Scripts/SpriteHook.js)

### 自定义材质类

继承自引擎的`Material`类，实现了一个[CustomMaterial](https://github.com/colinsusie/creator_2_0_material_demo/blob/master/assets/Scripts/CustomMaterial.js)，这个材质类可以实现各种不同的效果。

### Demo代码片段

高亮效果
```js
{
    var name = 'overlay';
    var mat = this.spImage.getMaterial(name);
    if (!mat) {
        var CustomMaterial = require("CustomMaterial");
        mat = new CustomMaterial(name);
        this.spImage.setMaterial(name, mat);	
    }
    this.spImage.node.color = new cc.Color().fromHEX("#FBC00C")
    this.spImage.activateMaterial(name);
}
```

雨效果
```js
// 雨珠效果
this.resetImage();

this._start = Date.now();
var name = 'rainheart';
var mat = this.spImage.getMaterial(name);
if (!mat) {
    var CustomMaterial = require("CustomMaterial");
    mat = new CustomMaterial(name, 
        [
            { name: 'texSize', type: renderer.PARAM_FLOAT2 },
            { name: 'iResolution', type: renderer.PARAM_FLOAT3 },
            { name: 'iTime', type: renderer.PARAM_FLOAT },
        ],
        [
            { name: 'HAS_HEART', value: false },
            { name: 'USE_POST_PROCESSING', value: true }
        ]);
    this.spImage.setMaterial(name, mat);
}
this.spImage.activateMaterial(name);
mat.texture.update({flipY: true});
var iResolution = new cc.Vec3(this.spImage.node.width, this.spImage.node.height, 0);
var texSize = new cc.Vec2(this.spImage.node.width, this.spImage.node.height);
mat.setParamValue("iResolution", iResolution);
mat.setParamValue("texSize", texSize);
```

### 增加更多的Shader效果

[Shaders](https://github.com/colinsusie/creator_2_0_material_demo/tree/master/assets/Scripts/Shaders)目录中只有两个，有兴趣的欢迎增加更多的效果：）
