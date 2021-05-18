import {
    Scene,
    Geometry,
    Vector3,
    Vertex,
    Line,
    PerspectiveCamera,
    WebGLRenderer,
    Mesh,
    MeshLambertMaterial,
    GridHelper,
    BoxGeometry,
    AmbientLight,
    PointLight,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments,
    Color,

} from 'three';
const OrbitControls = require('three-orbitcontrols')

import nistData from './data/nist_isotopes.json';
console.log(nistData);
import Nuclei from "./class/nuclei";

export default class App {


    constructor() {
        this.nucleis = nistData.map(nucleiInfo => new Nuclei(nucleiInfo));
        this.min = Infinity;
        this.max = 0;
        this.nucleis.forEach(nuclei => this.min = this.min > nuclei.stability ? nuclei.stability : this.min);
        this.nucleis.forEach(nuclei => this.max = this.max < nuclei.stability ? nuclei.stability : this.max);
        console.log('MINI', this.min, 'MAXI', this.max)
        console.log("Hydrogen", this.nucleis.filter(i => i.symbol === "H"));
        console.log("Carbon", this.nucleis.filter(i => i.symbol === "C"));
        this.scene = new Scene();
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.initialize();
    }

    rgbToHex([r, g, b]) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    colorGradient(color1, color2, gradient) {
        var w1 = gradient;
        var w2 = 1 - w1;
        var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
            Math.round(color1[1] * w1 + color2[1] * w2),
            Math.round(color1[2] * w1 + color2[2] * w2)];
        return this.rgbToHex(rgb);
    }
    initialize() {
        // Configure camera settings
        this.camera = new PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(new Vector3(0, 0, 0));

        const ALight = new AmbientLight(0xFFFFFF, 0.5);
        const pLight = new PointLight(0xFFFFFF, 0.5);
        pLight.position.set( 25, 50, 25 );
        this.scene.add(ALight);
        this.scene.add(pLight);

        this.renderer = new WebGLRenderer({antialias: true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xffffff, 1);

        document.body.appendChild(this.renderer.domElement);

        this.geometry = new Geometry();
        this.geometry.dynamic = true;
        this.geometry.vertices.push( new Vertex( new Vector3( - 500, 0, 0 ) ) );
        this.geometry.vertices.push( new Vertex( new Vector3( 500, 0, 0 ) ) );

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = true;
        this.controls.keys = {
            LEFT: 81,
            UP: 90,
            RIGHT: 68,
            BOTTOM: 83
        };
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;



        this.nucleis.forEach(n => {
            const height = (n.stability - this.min) / (this.max - this.min) * 10

            const geo = new BoxGeometry(1, height,1)
            const mat = new MeshLambertMaterial({
                color: this.colorGradient([255,0,0], [0,255,0], height / 10),
                //emissive: 0xFF0000,//Math.floor(Math.random() * Math.floor(Math.pow(2, 24))) },
            });
            const cube = new Mesh( geo, mat );
            cube.position.x = n.protons//(n.protons) - 1/2;
            cube.position.z = n.neutrons//(-1*n.neutrons) -1/2;
            cube.position.y += height / 2

            var sgeo = new EdgesGeometry( cube.geometry );
            var smat = new LineBasicMaterial( { color: new Color(69,69,69), linewidth: 1 } );
            var wireframe = new LineSegments( sgeo, smat );
            //cube.add( wireframe )
            wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd

            this.scene.add(cube)
        });
        this.renderer.render(this.scene, this.camera);
        this.render();
    }


    render() {
        requestAnimationFrame(() => {
            this.render()
        });
        this.renderer.render(this.scene, this.camera);
    }
}
