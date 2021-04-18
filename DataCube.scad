// higher values make the "bits" smoother, but cause a lot longer rendering times
$fn = 8;

// how thick should the outside frame be
frame_thickness = 5;

// how thick should the struts be that hold the bits? (recommended multiples of 0.4(nozzle diameter); at least 1.2)
strut_thickness = 1.2;

// the lenght of one side of the cube
size = 50;

// how many rows/cols/... of bits do we want (5 is a good value to handle a 128 bit hash)
n_cols = 2;
bps = n_cols;

// we need to know at which layer thickness this will be printed to adjust
// for optimal bridging
layer_height = 0.2;

// do we want to generate the supports?
generate_supports = true;

// how many voxels do we want? (only applicable if randomly generated data; float value between 0 and 1)
ratio_of_ones = 0.3;

// a random seed (only applicable if randomly generated data)
seed = 5;


total_bits = n_cols * n_cols * n_cols;
st = strut_thickness;
ft = frame_thickness;
usable_size = size - 2*frame_thickness;
us = usable_size;
sep = us / (n_cols+1); 


// some fake data
bits  = rands(0,1-ratio_of_ones, total_bits);

module HB_Cube() {
    union() {
        
        // the frame
        color("SlateGray") {
            cube([size, ft, ft]);
            translate([0,size-ft,0]) cube([size, ft, ft]);
            translate([0,0,size-ft]) cube([size, ft, ft]);
            translate([0,size-ft,size-ft]) cube([size, ft, ft]);
            cube([ft, size, ft]); 
            translate([size-ft,0,0]) cube([ft, size, ft]); 
            translate([0,0,size-ft-layer_height]) cube([ft, size, ft+layer_height]); 
            translate([size-ft,0,size-ft-layer_height]) cube([ft, size, ft+layer_height]); 
            cube([ft, ft, size]); 
            translate([size-ft,0,0]) cube([ft, ft, size]); 
            translate([0,size-ft,0]) cube([ft, ft, size]); 
            translate([size-ft,size-ft,0]) cube([ft, ft, size]); 
        }
        
        color("MediumOrchid") {
            // the horizontal struts
            for(i = [sep : sep : size-sep]) {
                translate([ft,ft-0.5*st+i,0]) cube([size-2*ft,st,st]);
                translate([ft,ft-0.5*st+i,size-st]) cube([size-2*ft,st,st]);
            }
            
            // the vertical struts
            for(i = [sep : sep : size-sep]) {
                for (j = [sep : sep : size-sep]) {
                    translate([i+ft-0.5*st,j+ft-0.5*st,0]) cube([st,st,size]);
                }
            }
            
            // even more struts
            for (z=[1:n_cols+1]) {
                for (y=[1:n_cols]) {
                    translate([ft+sep,ft+y*sep-0.5*st,z*sep+ft-0.5*st-7.5]) cube([(n_cols-1)*sep, st, st]);
                }
                for (x=[1:n_cols]) {
                    translate([ft+x*sep-0.5*st,ft+sep,z*sep+ft-0.5*st-7.5]) cube([st, (n_cols-1)*sep, st]);
                }
            }
        }
                
        // the bits
        color("Teal") {
        for(x = [1:n_cols]) {
            for (y = [1:n_cols]) {
                for (z = [0:n_cols]) {
                    if(bits[z*bps*bps+y*bps+x] > 0.5) {
                        translate([ft+x*sep,ft+y*sep,ft+z*sep+sep-6]) rotate_extrude() polygon([[0,0], [0,12], [5,6]]);
                    }
                }
            }
        }}
        
        // supports
        if (generate_supports) { color("Crimson") {
            off_set = sqrt((0.4*0.4)/2);
            supp_length = sqrt(ft*ft + ft*ft) - off_set - 0.12;
            
            for (i = [sep: sep : size-sep]) {
                translate([off_set,ft+i-0.5*ft,ft]) rotate([0,0,45]) cube([supp_length,0.4,size-2*ft]);
                translate([off_set+size-ft,ft+i-0.5*ft,ft]) rotate([0,0,45]) cube([supp_length,0.4,size-2*ft]);
                
                translate([ft+i-0.5*ft,0,ft]) rotate([0,0,45]) cube([supp_length,0.4,size-2*ft]);
                translate([ft+i-0.5*ft,size-ft,ft]) rotate([0,0,45]) cube([supp_length,0.4,size-2*ft]);
            }
        }}
    }
}

HB_Cube();