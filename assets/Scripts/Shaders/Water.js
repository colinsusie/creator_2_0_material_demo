// Shader: 水

var shader = {
    name: "Water",
    
    defines: [],

    vert: `uniform mat4 viewProj;
        attribute vec3 a_position;
        attribute vec2 a_uv0;
        varying vec2 uv0;
        void main () {
            vec4 pos = viewProj * vec4(a_position, 1);
            gl_Position = pos;
            uv0 = a_uv0;
        }
        `,

    frag: `uniform sampler2D texture;
    uniform vec3 iResolution;
    uniform float iTime;
    varying vec2 uv0;

    #define F cos(x-y)*cos(y),sin(x+y)*sin(y)

    vec2 s(vec2 p)
    {
        float d=iTime*0.2,x=8.*(p.x+d),y=8.*(p.y+d);
        return vec2(F);
    }
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // 换成resolution
        vec2 rs = iResolution.xy;
        // 换成纹理坐标v_texCoord.xy
        vec2 uv = fragCoord;
        vec2 q = uv+2./iResolution.x*(s(uv)-s(uv+rs));
        //反转y
        //q.y=1.-q.y;
        fragColor = texture2D(texture, q);
    }
    void main()
    {
        mainImage(gl_FragColor, uv0.xy);
    }`,
}

module.exports = shader;