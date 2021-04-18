var size = 100;
var ft = 5;
var st = 1.2;
var n_cols = 5;
var bit_h = 12;
var bit_w = 8;
var gen_support = true; 
var sw = 0.4;

var rsize = size/2;
var rft = ft/2;
var rst = st/2;

var us = size - 2*ft;
var rus = us / 2;
var sep = us / (n_cols+1);


function frame() {
    var far = [
        // bottom square
        CSG.cube({ center: [0,-(rsize-rft),-rsize+rft], radius: [rsize, rft, rft]}),
        CSG.cube({ center: [0,rsize-rft,-rsize+rft], radius: [rsize, rft, rft]}),
        CSG.cube({ center: [-(rsize-rft),0,-rsize+rft], radius: [rft, rsize, rft]}),
        CSG.cube({ center: [rsize-rft,0,-rsize+rft], radius: [rft, rsize, rft]}),

        // top square
        CSG.cube({ center: [0,-(rsize-rft),rsize-rft], radius: [rsize, rft, rft]}),
        CSG.cube({ center: [0,rsize-rft,rsize-rft], radius: [rsize, rft, rft]}),
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

function struts() {
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

    // even more struts
    for (i=0; i<n_cols; i++) {
        for (j=0; j<n_cols; j++) {
            sar.push(CSG.cube({ center: [-rsize+ft+i*sep+sep,0,-rsize+ft+j*sep+sep], radius: [rst, rsize-sep-ft, rst] }));
        }
    }

    st = sar.pop();
    return st.union(sar).setColor([0,0.263,0.412]);
}

function bits(data) {
    var bar = [];

    var bit = CSG.polyhedron({
        points: [ [0,0,bit_h/2], [0,0,-bit_h/2], // top/bottom points
                  [-bit_w/2,-bit_w/2,0], [-bit_w/2,bit_w/2,0], [bit_w/2,bit_w/2], [bit_w/2,-bit_w/2] // other points
                ],
        faces:  [ [0,5,2], [0,2,3], [0,3,4], [0,4,5],
                  [1,2,5], [1,3,2], [1,4,3], [1,5,4]
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

function support() {
    
    var sup = CAG.fromPoints([[-rft,-rft],[rft,rft],[rft,rft+sw],[-rft,-rft+sw]])
        .extrude({offset: [0,0,size-2*ft]})
        .translate([0,0,-rsize+ft]);

    var supar = [];
    var i;
    for (i=0; i<n_cols; i++) {
        supar.push(sup.translate([-rsize+rft,-rsize+i*sep+sep+rft,0]));
        supar.push(sup.translate([rsize-rft,-rsize+i*sep+sep+rft,0]));
        supar.push(sup.rotateZ(90).translate([-rsize+i*sep+sep+rft,-rsize+rft,0]));
        supar.push(sup.rotateZ(90).translate([-rsize+i*sep+sep+rft,rsize-rft,0]));
    }
    
    sups = supar.pop();
    return sups.union(supar).setColor([0.859,0.122,0.282]);
}

function main() {
    
    var data = [];
    var i;
    for (i=0; i<(n_cols*n_cols*n_cols); i++) {
        data.push(Math.round(Math.random()));
    }

    //rcube = CSG.cube({ center: [0,0,0], radius: [rsize-1, rsize-1, rsize-1] }); return rcube.union(frame());

    DataCube = frame().union(struts());
    DataCube = DataCube.union(bits(data));
    if (gen_support) {
       DataCube = DataCube.union(support());
    }
    return DataCube;
}
