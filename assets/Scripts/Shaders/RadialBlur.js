// Shader: 径向模糊

var shader = {
    name: "RadialBlur",
    
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
    uniform vec2 iCenter;
    varying vec2 uv0;

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        const float Strength = 0.125;    
        const int Samples = 64; //multiple of 2
        
        vec2 uv = fragCoord.xy;
        
        vec2 dir = (fragCoord.xy-iCenter.xy);
    
        vec4 color = vec4(0.0,0.0,0.0,0.0);
        
        for (int i = 0; i < Samples; i += 2) //operating at 2 samples for better performance
        {
            color += texture2D(texture,uv+float(i)/float(Samples)*dir*Strength);
            color += texture2D(texture,uv+float(i+1)/float(Samples)*dir*Strength);
        }   
        
        fragColor = color/float(Samples);
    }
     
    void main(void)
    {
        mainImage(gl_FragColor, uv0);
    }`,
}

module.exports = shader;