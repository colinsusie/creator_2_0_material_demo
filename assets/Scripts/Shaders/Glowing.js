// Shader: 外发光

var shader = {
    name: "Glowing",
    
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
    uniform vec4 color;
    varying vec2 uv0;

    const float radius = 4.0;
    // const vec3 color = vec3(0.9, 0.9, 0.0);

    float coefficient()
    {
        float v = mod(iTime, 3.0);
        if(v > 1.5)
            v = 3.0 - v;
        return v;
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = fragCoord.xy;
        vec2 unit = 1.0 / iResolution.xy;
        vec4 texel = texture2D(texture, uv);
        vec4 finalColor = vec4(0.0);
        float density = 0.0;

        if(texel.a >= 1.0)
        {
            finalColor = texel;
        }
        else
        {
            for(int i = 0; i < int(radius); ++i)
            {
                density += texture2D(texture, vec2(uv.x + unit.x * float(i), uv.y + unit.y * float(i))).a;
                density += texture2D(texture, vec2(uv.x - unit.x * float(i), uv.y + unit.y * float(i))).a;
                density += texture2D(texture, vec2(uv.x - unit.x * float(i), uv.y - unit.y * float(i))).a;
                density += texture2D(texture, vec2(uv.x + unit.x * float(i), uv.y - unit.y * float(i))).a;
            }
            density = density / radius;
            finalColor = vec4(color.rgb * density, density);
            finalColor += vec4(texel.rgb * texel.a, texel.a);
        }
        fragColor = finalColor;
    }

    void main()
    {
        mainImage(gl_FragColor, uv0.xy);
    }`,
}

module.exports = shader;