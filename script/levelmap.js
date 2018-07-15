var filterList = [
    "air", //0
    "backdrop",
    "wall",
    "wall_grass",
    "ramp_l", //4
    "ramp_r",
    "cap_lr",
    "cap",
    "cap_l", //8
    "cap_r",
    "rampcap_l",
    "rampcap_r",
    "crate", //12
    "crate_top",
    "leaf",
    "wall_bottom_l",
    "wall_bottom_r", //16
    "fairy",
    "checkpoint"
]

// 96 x 32
var LMC = [
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0,  0,  1,  0,  1,  0,  0, 17,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  0, 14,  1, 14,  0,  0,  0,  0, 14,  1,  0,  0,  0,  1, 14, 14,  1,  0,  1,  0,  0, 14,  1, 14,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17,  2,  2,  2,  2,  2,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0, 14,  1,  0,  0,  1, 14,  1,  0,  0,  0,  1,  0,  0,  0, 18,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0,  0,  1,  0,  1,  0,  0,  0,  1,  0,  4,  2,  2,  2,  5,  0,  0,  0,  0,  0,  0,  0, 14,  2,  2,  5,  0,  0,  0, 17,  0,  0,  0,  4,  2,  0,  0,  0,  0,  0,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17,  0,  0,  0,  4,  2,  5,  0,  0,  4,  2,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  0,  0,  1, 14,  4,  2,  2,  2,  2, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,  1,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0,  0,  0, 14,  2,  2,  2,  5,  0, 17,  0, 17,  0,  4,  2,  2,  0,  0,  0,  0,  0,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2, 14, 14,  2,  2,  2,  2,  2,  2,  0, 14,  1,  0,  2,  2,  2,  2,  2,  1,  0,  0,  0,  1,  0,  0,  1, 14,  1,  0,  0,  0,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  0,  0,  1,  0,  0,  0,  2,  2,  2,  1,  0,  0,  0,  1,  0, 14,  1,  0,  1, 14,  0,  0,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0, 18,  0,  2,  2,  2,  2,  2,  2, 12,  0,  1,  0,  0,  4,  2,  2,  2,  1,  0,  0,  0,  1,  0,  0,  1, 14,  1,  0,  0,  0,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12,  0,  1, 14,  0,  2,  2,  2,  2,  1, 17,  0, 14,  1, 14,  0,  1, 14,  1, 14,  0,  0,  1,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2],
    [ 2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12, 14,  1,  0,  4,  2,  2,  2,  2,  1, 14,  0,  0,  1,  0, 14,  1,  0,  1,  0,  0, 14,  1,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2],
    [ 2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  4,  2,  5, 17,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12,  0,  1,  0,  2,  2,  2,  2,  2,  1,  0,  0,  0,  1,  0,  0,  1,  0,  1,  0,  0, 17,  1, 14,  0,  0,  0, 17,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0, 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2],
    [ 2,  2,  2,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12,  0,  1,  0,  2,  2,  2,  0, 14,  1,  0,  0,  0,  1,  0,  0,  1,  0,  1,  0,  0, 14,  1,  0,  0,  0,  0,  0,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2],
    [ 2,  2,  2,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12, 12,  1, 14,  0,  0,  0,  0,  0,  1,  0,  0, 14,  1,  0, 14,  1,  0,  1,  0,  0,  0,  1,  0,  0,  0,  0, 12,  2,  2,  2,  0,  0,  0, 17,  0,  0,  0,  0,  4,  2,  2, 12, 12, 12,  2,  5,  0,  0, 17,  0,  0,  0,  0,  0, 17,  2,  2],
    [ 2,  2,  0,  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  0,  0,  2,  2,  2,  2,  2, 17,  0,  2,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12, 12,  1,  0,  0,  0,  0,  0,  0,  1, 14,  0,  0,  1,  0,  0,  1,  0,  1, 14,  0,  0,  1,  0,  0,  0, 12, 12,  2,  2,  2,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2, 12, 17, 12,  2,  2,  5,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2],
    [ 2, 17,  0,  0, 12,  0,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  0,  0,  0,  0,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12, 12,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0, 14,  1,  0,  0,  1, 14,  1,  0,  0,  0,  1,  0,  0,  0, 12, 12,  2,  2,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  0,  0,  0, 12,  0,  0,  0, 17,  0,  0,  0,  0,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12, 12,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0, 14,  1,  0,  0,  1,  0,  1,  0,  0, 14,  1, 14,  0,  2,  2,  2,  2,  2,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  0,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12, 12,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1, 14,  0,  1,  0,  1, 14,  0,  0,  1,  0,  0,  2,  2,  1,  1,  0,  0,  0,  0,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  0,  0, 12,  0, 12, 12, 12,  0,  0,  0,  0,  0,  0,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  1, 14,  0,  0,  1,  0,  0,  1, 14,  1,  0,  0,  0,  1, 14,  0,  2,  2,  1,  1, 14,  0,  0,  0,  2,  2,  2, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0, 17,  0,  2,  2,  5,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  1,  0,  0,  0,  1, 14,  0,  1,  0,  1,  0,  0, 14,  1,  0,  0,  2,  2,  1,  2,  0,  0,  0, 14,  2,  2, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0,  0,  2,  2,  2,  2,  2,  2,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0, 14,  1,  0,  0, 14,  1,  0,  0,  1,  0,  1, 14,  0,  0,  1,  0,  0,  2,  2,  1,  2,  0,  0,  0,  0,  2, 12, 12, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 14,  0,  0,  2,  2,  2,  2,  2,  2,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0, 14,  1,  0,  1,  0,  0, 14,  1,  0,  0,  2,  2,  1,  2,  0,  0,  0,  0, 12, 12, 12, 12, 12, 12, 12,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  1, 14,  0,  0,  1,  0,  0,  1,  0,  1, 14,  0,  0,  1, 14,  0,  2,  2,  1,  2,  5,  0,  0, 18,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  0,  0, 17,  0,  0,  0,  4,  2,  2,  2,  2,  2, 17,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  2,  2,  0,  0,  0,  0,  1,  0,  0, 14,  1, 14,  0,  1,  0,  1,  0,  0, 14,  1,  0,  0,  2,  2,  1,  2,  2,  2,  2, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  2],
    [ 2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2, 14, 14,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14,  1, 14,  0,  4,  2,  5,  0,  1, 14,  1,  0,  0,  0,  1,  0,  0,  2,  2,  0,  2,  2,  2,  2,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  0,  4,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0, 14,  2,  2,  0,  0,  0,  4,  2,  5,  0,  1,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  1,  0,  4,  2,  2,  0,  0,  0,  2,  2,  0,  0,  0, 17,  0,  0,  0,  1, 14,  0,  0,  2,  2,  2,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  0,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  0, 18,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 17,  0,  0,  2,  2,  5,  0,  0,  0,  0,  0, 17,  1,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  0,  0, 12, 12, 12, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 14, 14, 14, 14,  2,  2,  2,  2,  2,  5,  0,  0,  0,  1, 17,  0,  0,  0,  0,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  2,  2,  2, 17,  0,  0,  0, 17,  0,  0,  0,  0,  0,  0,  2,  2,  2,  0,  0, 12, 12, 12, 12, 17, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  0,  0, 14,  1,  0,  0, 14,  2,  5,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  0,  0,  0,  0,  0, 18,  0, 12, 12,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0, 12, 12, 12, 12, 12, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 17,  0,  0,  0,  0,  0,  2,  2,  0,  1,  1,  0,  0,  0,  0,  1,  0,  0,  0,  2,  2,  0,  0,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0, 12,  0,  0,  0,  0,  0, 12, 17, 12, 12, 12, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0,  0,  0,  0,  0,  0,  2,  1,  0,  0,  0, 12,  1, 12,  0,  0,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2],
    [ 0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0, 12,  0,  0,  0,  0, 12, 12, 12, 12, 12,  0,  0,  0,  0, 12, 12, 12,  0, 12, 12, 17, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0, 17,  4,  2,  1,  0, 17, 12, 12,  1, 12, 12,  0,  2,  2,  5, 18,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2]
]

function importLevelMap() {
    for (var i = fairies.children.length - 1; i >= 0; i--) {
        objects.removeChild(fairies.children[i].heart);
        fairies.removeChild(fairies.children[i]);
    }

    for (var i = checkpoints.children.length - 1; i >= 0; i--) {
        checkpoints.removeChild(checkpoints.children[i]);
    }

    levelMap = [];
    var levelMapRow;
    for (var i = 0; i < levelProperties.gridWidth; i++) {
        levelMapRow = [];
        for (var j = 0; j < levelProperties.gridHeight; j++) {
            var n;
            for (n = 0; n < tileType.index.length; n++) {
                if (filterList[LMC[j][i]] == tileType.index[n].name) {
                    levelMapRow.push(n);
                    //levelMapRow.push(tileType.wall.id);
                    break;
                }
            }
            if (n == tileType.index.length) {
                if (filterList[LMC[j][i]] == "fairy") {
                    levelMapRow.push(tileType.air.id);
                    o = new PIXI.Sprite(spriteAtlas["fairy"]);
                    o.anchor.set(0.5, 0.5);
                    o.hauntX = (i + 0.5) * levelProperties.grid;
                    o.hauntY = (j + 0.5) * levelProperties.grid;
                    o.x = o.hauntX;
                    o.y = o.hauntY;
                    o.vx = 0;
                    o.vy = 0;
                    o.vvx = 0;
                    o.vvy = 0;
                    o.hx = o.hauntX;
                    o.hy = o.hauntY;
                    o.cooldown_1 = 0;
                    o.cooldown_2 = 4;
                    o.super = false;
                    fairies.addChild(o);
                } else if (filterList[LMC[j][i]] == "checkpoint") {
                    levelMapRow.push(tileType.hard_air.id);
                    o = new PIXI.Sprite(tileAtlas["checkpoint"]);
                    o.x = i * levelProperties.grid;
                    o.y = j * levelProperties.grid;
                    checkpoints.addChild(o);
                } else {
                    levelMapRow.push(tileType.backdrop.id);
                }
            }
        }
        levelMap.push(levelMapRow);
    }

    for (var i = 0; i < levelProperties.gridWidth; i++) {
        for (var j = 0; j < levelProperties.gridHeight - 1; j++) {
            if (levelMap[i][j] == tileType.air.id && levelMap[i][j + 1] == tileType.wall.id) {
                levelMap[i][j + 1] = tileType.wall_grass.id;
                if (i <= 0 || (
                    tileType.index[levelMap[i - 1][j + 1]].grass
                    && tileType.index[levelMap[i - 1][j]].grow
                    || tileType.index[levelMap[i - 1][j]].block
                )) {
                    if (i >= levelProperties.gridWidth - 1 || (
                        tileType.index[levelMap[i + 1][j + 1]].grass
                        && tileType.index[levelMap[i + 1][j]].grow
                        || tileType.index[levelMap[i + 1][j]].block
                    )) {
                        levelMap[i][j] = tileType.cap.id;
                    } else {
                        levelMap[i][j] = tileType.cap_r.id;
                    }
                } else {
                    if (i >= levelProperties.gridWidth - 1 || (
                        tileType.index[levelMap[i + 1][j + 1]].grass
                        && tileType.index[levelMap[i + 1][j]].grow
                        || tileType.index[levelMap[i + 1][j]].block
                    )) {
                        levelMap[i][j] = tileType.cap_l.id;
                    } else {
                        levelMap[i][j] = tileType.cap_lr.id;
                    }
                }
            }
            if (levelMap[i][j] == tileType.air.id && levelMap[i][j + 1] == tileType.ramp_l.id) {
                levelMap[i][j] = tileType.rampcap_l.id;
            }
            if (levelMap[i][j] == tileType.air.id && levelMap[i][j + 1] == tileType.ramp_r.id) {
                levelMap[i][j] = tileType.rampcap_r.id;
            }
            if (levelMap[i][j] == tileType.air.id && levelMap[i][j + 1] == tileType.crate.id) {
                levelMap[i][j] = tileType.crate_top.id;
            }
            if (levelMap[i][j] == tileType.wall.id && levelMap[i][j + 1] != tileType.wall.id) {
                var t1, t2;
                if (i > 0) t1 = levelMap[i - 1][j];
                else t1 = tileType.wall.id;
                if (i < levelProperties.gridWidth - 1) t2 = levelMap[i + 1][j];
                else t2 = tileType.wall.id;

                if (t1 == tileType.wall.id || t1 == tileType.wall_grass.id || t1 == tileType.ramp_l.id || t1 == tileType.wall_bottom_l.id) {
                    if (t2 == tileType.wall.id || t2 == tileType.wall_grass.id || t2 == tileType.ramp_r.id || t2 == tileType.wall_bottom_r.id) {
                    } else {
                        levelMap[i][j] = tileType.wall_bottom_r.id;
                    }
                } else {
                    if (t2 == tileType.wall.id || t2 == tileType.wall_grass.id || t2 == tileType.ramp_r.id || t2 == tileType.wall_bottom_r.id) {
                        levelMap[i][j] = tileType.wall_bottom_l.id;
                    }
                }
            }
        }
    }

    for (var i = 0; i < fairies.children.length; i++) {
        fairies.children[i].heart = new PIXI.Sprite(spriteAtlas["fairy_heart"]);
        fairies.children[i].heart.anchor.set(0.5, 0.5);
        fairies.children[i].heart.x = fairies.children[i].x;
        fairies.children[i].heart.y = fairies.children[i].y;
        objects.addChild(fairies.children[i].heart);
    }
}
