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

} from 'three';
const OrbitControls = require('three-orbitcontrols')

import nistData from './data/nist_isotopes.json';
console.log(nistData);
import Nuclei from "./class/nuclei";

export default class App {
    constructor() {
        this.nucleis = nistData.map(nucleiInfo => new Nuclei(nucleiInfo));
        console.log("Hydrogen", this.nucleis.filter(i => i.symbol === "H"));
        console.log("Carbon", this.nucleis.filter(i => i.symbol === "C"));
        this.scene = new Scene();
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.initialize();
    }



    initialize() {
        // Configure camera settings
        this.camera = new PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(new Vector3(0, 0, 0));

        const ALight = new AmbientLight(0xFFFFFF, 0.5);
        const pLight = new PointLight(0xFFFFFF, 0.5);
        pLight.position.set( 0, 0, 50 );
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
            const geo = new BoxGeometry(1,1,1/n.stability)
            const mat = new MeshLambertMaterial({
                color: 0xF2FFEC,
                //emissive: 0xFF0000,//Math.floor(Math.random() * Math.floor(Math.pow(2, 24))) },
            });
            const cube = new Mesh( geo, mat );
            cube.position.x = n.protons//(n.protons) - 1/2;
            cube.position.y = n.neutrons//(-1*n.neutrons) -1/2;
            console.log(`${n.symbol}(${n.protons},${n.neutrons})${1/Math.pow(n.stability,2)}`)
            //cube.position.z +=  cube.geometry.parameters.height/2;
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
