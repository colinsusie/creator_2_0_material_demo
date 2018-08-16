var SpriteHook = {
}

SpriteHook.init = function() {
    // 支持自定义Shader
    const renderEngine = cc.renderer.renderEngine;
    const SpriteMaterial = renderEngine.SpriteMaterial;
    const GraySpriteMaterial = renderEngine.GraySpriteMaterial;
    const STATE_CUSTOM = 101;

    var sprite = new cc.Sprite();

    // 取自定义材质
    sprite.__proto__.getMaterial = function(name) {
        if (this._materials) {
            return this._materials[name];
        } else {
            return undefined;
        }
    }

    // 设置自定义材质
    sprite.__proto__.setMaterial = function(name, mat) {
        if (!this._materials) {
            this._materials = {}
        }
        this._materials[name] = mat;
    }

    // 激活某个材质
    sprite.__proto__.activateMaterial = function(name) {
        var mat = this.getMaterial(name);
        if (mat && mat !== this._currMaterial) {
            if (mat) {
                if (this.node) {
                    mat.color = this.node.color;
                }
                if (this.spriteFrame) {
                    mat.texture = this.spriteFrame.getTexture();
                }
                this.node._renderFlag |= cc.RenderFlow.FLAG_COLOR;
                this._currMaterial = mat;
                this._currMaterial.name = name;
                this._state = STATE_CUSTOM;
                this._activateMaterial();
            } else {
                console.error("activateMaterial - unknwon material: ", name);
            }
        }
    }

    // 取当前的材质
    sprite.__proto__.getCurrMaterial = function() {
        if (this._state === STATE_CUSTOM) {
            return this._currMaterial;
        }
    }

    sprite.__proto__._activateMaterial = function() {
        if (!this.enabledInHierarchy) {
            this.disableRender();
            return;
        }

        let spriteFrame = this._spriteFrame;
        // cannot be activated if texture not loaded yet
        if (!spriteFrame || !spriteFrame.textureLoaded()) {
            this.disableRender();
            return;
        }

        // WebGL
        if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
            // Get material
            let texture = spriteFrame.getTexture();
            let material;
            if (this._state === cc.Sprite.State.GRAY) {
                if (!this._graySpriteMaterial) {
                    this._graySpriteMaterial = new GraySpriteMaterial();
                    this.node._renderFlag |= cc.RenderFlow.FLAG_COLOR;
                }
                material = this._graySpriteMaterial;
                this._currMaterial = null;
            }
            else if (this._state === STATE_CUSTOM) {
                if (!this._currMaterial) {
                    console.error("_activateMaterial: _currMaterial undefined!")
                    return;
                }
                material = this._currMaterial;
            }
            else {
                if (!this._spriteMaterial) {
                    this._spriteMaterial = new SpriteMaterial();
                    this.node._renderFlag |= cc.RenderFlow.FLAG_COLOR;
                }
                material = this._spriteMaterial;
                this._currMaterial = null;
            }
            // TODO: old texture in material have been released by loader
            if (material.texture !== texture) {
                material.texture = texture;
                this._updateMaterial(material);
            }
            else if (material !== this._material) {
                this._updateMaterial(material);
            }
            if (this._renderData) {
                this._renderData.material = material;
            }
        }
        
        this.markForUpdateRenderData(true);
        this.markForRender(true);
    }
}

module.exports = SpriteHook;