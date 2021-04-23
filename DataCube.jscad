// vim: set syntax=javascript:

function getParameterDefinitions() {
    return [
        { name: 'gen_support', caption: 'Generate supports?', type: 'choice', values: ["No", "Yes"], default: "No", captions: ['No', 'Yes']}, 
        { name: 'sw', caption: 'Thickness of the supports:', type: 'float', default: 0.4},
        { name: 'size', caption: 'Length of one side of the cube:', type: 'int', default: 100 },
        { name: 'ft', caption: 'Thickness of the outer frame:', type: 'int', default: 5 },
        { name: 'st', caption: 'Thickness of the struts inside the cube:', type: 'float', default: 1.2 },
        { name: 'n_cols', caption: 'Number of columns/rows/levels of the cube:', type: 'int', default: 5},
        { name: 'bit_h', caption: 'Height of one "bit":', type: 'int', default: 12},
        { name: 'bit_w', caption: 'Width of one "bit":', type: 'int', default: 8},
        { name: 'fr_offset', caption: 'Height offset (for better bridges):', type: 'float', default: 0.2 }
    ];
}

function frame(rsize, rft, fr_offset) {
    var far = [
        // bottom square
        CSG.cube({ center: [0,-(rsize-rft),-rsize+rft], radius: [rsize, rft, rft]}),
        CSG.cube({ center: [0,rsize-rft,-rsize+rft], radius: [rsize, rft, rft]}),
        CSG.cube({ center: [-(rsize-rft),0,-rsize+rft], radius: [rft, rsize, rft]}),
        CSG.cube({ center: [rsize-rft,0,-rsize+rft], radius: [rft, rsize, rft]}),

        // top square
        CSG.cube({ center: [0,-(rsize-rft),rsize-rft-fr_offset], radius: [rsize, rft, rft+fr_offset]}),
        CSG.cube({ center: [0,rsize-rft,rsize-rft-fr_offset], radius: [rsize, rft, rft+fr_offset]}),
        CSG.cube({ center: [-(rsize-rft),0,rsize-rft], radius: [rft, rsize, rft]}),
        CSG.cube({ center: [rsize-rft,0,rsize-rft], radius: [rft, rsize, rft]}),

        // pillars
        CSG.cube({ center: [-rsize+rft,-rsize+rft,0], radius: [rft, rft, rsize]}),
        CSG.cube({ center: [rsize-rft,-rsize+rft,0], radius: [rft, rft, rsize]}),
        CSG.cube({ center: [-rsize+rft,rsize-rft,0], radius: [rft, rft, rsize]}),
        CSG.cube({ center: [rsize-rft, rsize-rft,0], radius: [rft, rft, rsize]})
    ];

    fr = far.pop();
    return fr.union(far).setColor([0,0.263,0.412]);
}

function struts(rsize, ft, sep, rst, n_cols) {
    var sar = [];
    
    // top and bottom struts
    var i;
    for (i=0; i<n_cols; i++) {
        // bottom
        sar.push(CSG.cube({ center: [0,-rsize+ft+i*sep+sep,-rsize+rst], radius: [rsize, rst, rst] }));
        // top
        sar.push(CSG.cube({ center: [0,-rsize+ft+i*sep+sep,rsize-rst], radius: [rsize, rst, rst] }));
    }

    // vertical struts
    var j;
    for (i=0; i<n_cols; i++) {
        for (j=0; j<n_cols; j++) {
            sar.push(CSG.cube({ center: [-rsize+ft+i*sep+sep,-rsize+ft+j*sep+sep,0], radius: [rst, rst, rsize] }));
        }
    }

    // more horizontal struts
    for (i=0; i<n_cols; i++) {
        for (j=0; j<n_cols+1; j++) {
            sar.push(CSG.cube({ center: [-rsize+ft+i*sep+sep,0,-rsize+ft+j*sep+0.5*sep], radius: [rst, rsize-sep-ft, rst] }));
            sar.push(CSG.cube({ center: [0, -rsize+ft+i*sep+sep, -rsize+ft+j*sep+0.5*sep], radius: [rsize-sep-ft, rst, rst] }));
        }
    }

    st = sar.pop();
    return st.union(sar).setColor([0,0.263,0.412]);
}

function bits(data, rsize, ft, sep, n_cols, bit_h, bit_w) {
    var bar = [];

    var bit = CSG.polyhedron({
        points: [ [0,0,bit_h/2], [0,0,-bit_h/2], // top/bottom points
                  [-bit_w/2,-bit_w/2,0], [-bit_w/2,bit_w/2,0], [bit_w/2,bit_w/2], [bit_w/2,-bit_w/2] // other points
                ],
        faces:  [ [0,5,2], [0,2,3], [0,3,4], [0,4,5], // top half
                  [1,2,5], [1,3,2], [1,4,3], [1,5,4]  // bottom half
                ]
    });

    bar = [];
    count = 0;
    var i; 
    var j; 
    var k;
    for (i=0; i<n_cols; i++) {
        for (j=0; j<n_cols; j++) {
            for (k=0; k<n_cols; k++) {
                if (data[count]) { // bit is one
                    bar.push(bit.translate([-rsize+ft+sep+i*sep, -rsize+ft+sep+j*sep, -rsize+ft+sep+k*sep]));
                }
                count++;
            }
        }
    }
    
    bi = bar.pop();
    return bi.union(bar).setColor([0.004, 0.58, 0.604]);
}

function support(rft, sw, size, rsize, ft, sep, n_cols) {
    
    var sup = CAG.fromPoints([[-rft,-rft],[rft,rft],[rft,rft+sw],[-rft,-rft+sw]])
        .extrude({offset: [0,0,size-2*ft]})
        .translate([0,0,-rsize+ft]);
    
    var hsup = CAG.fromPoints([[ft-rft-rsize+sep, rft], [rft+rsize-2*ft-sep, rft], [-ft+rft+rsize-sep, -rft], [rft-rsize+ft+sep, -rft]])
        .extrude({offset: [0,0,sw]})
        .translate([-0.5*sw,0,0]);
        

    var supar = [];
    var i;
    // vertical supports
    for (i=0; i<n_cols; i++) {
        supar.push(sup.translate([-rsize+rft, -rsize+i*sep+sep+ft-sw*0.5, 0]));
        supar.push(sup.translate([rsize-rft, -rsize+i*sep+sep+ft-sw*0.5, 0]));
        supar.push(sup.rotateZ(90).translate([-rsize+i*sep+sep+ft-sw*0.5, -rsize+rft, 0]));
        supar.push(sup.rotateZ(90).translate([-rsize+i*sep+sep+ft-sw*0.5, rsize-rft, 0]));
    }

    // horizontal supports
    for (i=0; i<n_cols; i++) {
        supar.push(hsup.translate([0,-rsize+rft,0]));
    }
    
    sups = supar.pop();
    return sups.union(supar).setColor([0.859,0.122,0.282]);
}

function main(params) {
    
    var us = params.size - 2 * params.ft;
    var sep = us / (params.n_cols+1);
    
    var data = [];
    var i;
    for (i=0; i<(params.n_cols*params.n_cols*params.n_cols); i++) {
        data.push(Math.round(Math.random()));
    }

    DataCube = frame(params.size/2, params.ft/2, params.fr_offset).union(struts(params.size/2, params.ft, sep, params.st/2, params.n_cols));
    DataCube = DataCube.union(bits(data, params.size/2, params.ft, sep, params.n_cols, params.bit_h, params.bit_w));
    if (params.gen_support == "Yes") {
       DataCube = DataCube.union(support(params.ft/2, params.sw, params.size, params.size/2, params.ft, sep, params.n_cols));
    }
    return DataCube;
}
