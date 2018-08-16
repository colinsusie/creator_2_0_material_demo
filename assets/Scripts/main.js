const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;

cc.Class({
    extends: cc.Component,

    properties: {
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
        // TODO: 加更多Shader
    },

    resetImage() {
        this.spImage.node.color = new cc.Color().fromHEX("#FFFFFF")
        this.spImage.spriteFrame.getTexture().update({flipY: false});
    },

    onClickGray () {
        // 灰度图
        this.resetImage();
        this.spImage.setState(cc.Sprite.State.GRAY);
    },

    onClickNormal () {
        // 正常
        this.resetImage();
        this.spImage.setState(cc.Sprite.State.NORMAL);
    },

    onClickOverlay () {
        // 颜色高亮效果
        this.resetImage();
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
    },

    onClickWave () {
        this.resetImage();
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

    update() {
        const mat = this.spImage.getCurrMaterial();
        if (!mat) {
            return;
        }

        if (["rainheart", "wave"].includes(mat.name)) {
            const now = Date.now();
            const time = (now - this._start) / 1000;
            mat.setParamValue('iTime', time);
        }
    },
});
