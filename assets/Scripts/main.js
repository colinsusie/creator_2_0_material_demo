const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

cc.Class({
    extends: cc.Component,

    properties: {
        frame1: cc.SpriteFrame,
        frame2: cc.SpriteFrame,
        spImage: cc.Sprite,
    },

    start () {
        require("SpriteHook").init();
        this.initShaders();
    },

    initShaders() {
        var ShaderLib = require("ShaderLib");
        ShaderLib.addShader(require("OverlayShader"));
        ShaderLib.addShader(require("RainShader"));
        ShaderLib.addShader(require("WaveShader"));
        ShaderLib.addShader(require("GaussBlurs"));
        ShaderLib.addShader(require("Outline"));
        ShaderLib.addShader(require("Glowing"));
        ShaderLib.addShader(require("Water"));
        ShaderLib.addShader(require("Mosaic"));
        // TODO: 加更多Shader
    },

    resetImage(frame) {
        this.spImage.node.color = new cc.Color().fromHEX("#FFFFFF")
        this.spImage.spriteFrame.getTexture().update({flipY: false});
        this.spImage.spriteFrame = frame;
    },

    onClickGray () {
        // 灰度图
        this.resetImage(this.frame1);
        this.spImage.setState(cc.Sprite.State.GRAY);
    },

    onClickNormal () {
        // 正常
        this.resetImage(this.frame1);
        this.spImage.setState(cc.Sprite.State.NORMAL);
    },

    onClickOverlay () {
        // 颜色高亮效果
        this.resetImage(this.frame2);
        var name = 'overlay';
        var mat = this.spImage.getMaterial(name);
        if (!mat) {
            var CustomMaterial = require("CustomMaterial");
            mat = new CustomMaterial(name);
            this.spImage.setMaterial(name, mat);
        }
        this.spImage.node.color = new cc.Color().fromHEX("#FBC00C")
        this.spImage.activateMaterial(name);
    },

    onClickRain () {
        // 雨珠效果
        this.resetImage(this.frame1);

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
    },

    onClickWave () {
        this.resetImage(this.frame1);
        const name = 'wave';
        this._start = Date.now();
        let mat = this.spImage.getMaterial(name);

        if (!mat) {
            const CustomMaterial = require("CustomMaterial");
            mat = new CustomMaterial(name, [
                {name: 'iTime', type: renderer.PARAM_FLOAT},
                {name: 'iOffset', type: renderer.PARAM_FLOAT2}
            ]);
            this.spImage.setMaterial(name, mat);
        }
        this.spImage.activateMaterial(name);
        mat.setParamValue('iOffset', new cc.Vec2(0, 1.0));
    },

    onClickBlurs () {
        this.resetImage(this.frame1);
        const name = 'GaussBlurs';
        let mat = this.spImage.getMaterial(name);
        if (!mat) {
            const CustomMaterial = require("CustomMaterial");
            mat = new CustomMaterial(name, [
                {name: 'bluramount', type: renderer.PARAM_FLOAT},
            ]);
            this.spImage.setMaterial(name, mat);
        }
        this.spImage.activateMaterial(name);
        mat.setParamValue('bluramount', 0.05);
    },

    onClickOutline() {
        this.resetImage(this.frame1);
        const name = 'Outline';
        let mat = this.spImage.getMaterial(name);
        if (!mat) {
            const CustomMaterial = require("CustomMaterial");
            mat = new CustomMaterial(name, [
                { name: 'iResolution', type: renderer.PARAM_FLOAT3 },
            ]);
            this.spImage.setMaterial(name, mat);
        }
        this.spImage.activateMaterial(name);
        var iResolution = new cc.Vec3(this.spImage.node.width, this.spImage.node.height, 0);
        mat.setParamValue("iResolution", iResolution);
    },

    onClickGrowing() {
        this.resetImage(this.frame2);
        const name = 'Glowing';
        this._start = Date.now();
        let mat = this.spImage.getMaterial(name);
        if (!mat) {
            const CustomMaterial = require("CustomMaterial");
            mat = new CustomMaterial(name, [
                {name: 'iResolution', type: renderer.PARAM_FLOAT3},
                {name: 'iTime', type: renderer.PARAM_FLOAT},
            ]);
            this.spImage.setMaterial(name, mat);
        }
        this.spImage.node.color = new cc.Color().fromHEX("#1A7ADC")
        this.spImage.activateMaterial(name);
        var iResolution = new cc.Vec3(this.spImage.node.width, this.spImage.node.height, 0);
        mat.setParamValue("iResolution", iResolution);
    },

    onClickWater() {
        this.resetImage(this.frame1);
        const name = 'Water';
        this._start = Date.now();
        let mat = this.spImage.getMaterial(name);
        if (!mat) {
            const CustomMaterial = require("CustomMaterial");
            mat = new CustomMaterial(name, [
                {name: 'iResolution', type: renderer.PARAM_FLOAT3},
                {name: 'iTime', type: renderer.PARAM_FLOAT},
            ]);
            this.spImage.setMaterial(name, mat);
        }
        this.spImage.activateMaterial(name);
        var iResolution = new cc.Vec3(this.spImage.node.width, this.spImage.node.height, 0);
        mat.setParamValue("iResolution", iResolution);
    },

    onClickMosaic() {
        this.resetImage(this.frame1);
        const name = 'Mosaic';
        this._start = Date.now();
        let mat = this.spImage.getMaterial(name);
        if (!mat) {
            const CustomMaterial = require("CustomMaterial");
            mat = new CustomMaterial(name, [
                {name: 'iResolution', type: renderer.PARAM_FLOAT3},
                {name: 'mosaicSize', type: renderer.PARAM_FLOAT},
                {name: 'iTime', type: renderer.PARAM_FLOAT},
            ]);
            this.spImage.setMaterial(name, mat);
        }
        this.spImage.activateMaterial(name);
        var iResolution = new cc.Vec3(this.spImage.node.width, this.spImage.node.height, 0);
        mat.setParamValue("iResolution", iResolution);
        mat.setParamValue("mosaicSize", 16); 
    },

    update() {
        const mat = this.spImage.getCurrMaterial();
        if (!mat) {
            return;
        }

        if (["rainheart", "wave", "Glowing", "Water", "Mosaic"].includes(mat.name)) {
            const now = Date.now();
            const time = (now - this._start) / 1000;
            mat.setParamValue('iTime', time);
        }
    },
});
