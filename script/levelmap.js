"use strict"

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
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0,  0,  1,  0,  1,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17,  0,  2,  2,  2,  2,  2,  0, 14,  1, 14,  0,  0,  0,  0, 14,  1,  0,  0,  0,  1, 14, 14,  1,  0,  1,  0,  0,214,  1, 14,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17,  2,  2,  2,  2,  2,  0,  0,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0, 14,  1,  0,  0,  1, 14,  1,  0,  0,  0,  1,  0,  0,  0, 18,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17,  0,  0,  0,  0,  0,  0,  4,  2,  0,  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  1,  0,  0,  0,  0,  0,  0,201,  0,  0,  0,  1,  0,  0,  1,  0,  1,  0,  0,  0,  1, 17,  4,  2,  2,  2,  5,  0,  0,  0,  0,  0,  0,  0, 14,  2,  2,  5,  0,  0,  0, 17,  0,  0,  0,  4,  2,  0,  0,  0,  0,  0,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  5,  0,  0,  4,  2,  2,  2,  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  1, 14,  4,  2,  2,  2,  2,  1, 12, 12, 12, 12, 12, 12, 12, 14, 12, 12, 12, 12,  1,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0,  0,  0, 14,  2,  2,  2,  5,  0, 17,  0,  0, 17,  4,  2,  2,  0,  0,  0,  0,  0,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,108,108,108,  2,  2,  2,  2,  2,  0, 14,  1,  0,  2,  2,  2,  2,  2,  1,  0,  0,  0,  1,  0,  0,  1, 14,  1,  0,  0,  0,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  1,  0,  0,  0,  2,  2,  0,  1,  0,  0,  0,  1,  0, 14,  1,  0,  1, 14,  0,  0,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0, 18,  0,  4,  2,  2,  2,  2,  2, 12,  0,  1,  0,  0,  4,  2,  2,  0,  1,  0,  0,  0,  1,  0,  0,  1, 14,  1,  0,  0,  0,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12,  0,  1, 14,  0,  2,  2,200,  0,  1,  0,  0, 14,  1, 14,  0,  1, 14,  1, 14,  0,  0,  1,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2],
    [ 2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12, 14,  1,  0,  4,  2,  2,  2,  2,  1, 14,  0,  0,  1,  0, 14,  1,  0,  1,  0,  0, 14,  1,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2],
    [ 2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12,  0,  1,  0,  2,  2,  2,  2,  2,  1,  0,  0,  0,  1,  0,  0,  1,  0,  1,  0,  0,  0,  1, 14,  0,  0,  0, 17,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0, 17,  0,  0,  0,  0,  0,  0,  0,214,  0,  0,  0,  0,  0,  0,  2,  2,  2],
    [ 2,  2,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12,  0,  1,  0,  2,  2,  2,  0, 14,  1,  0,  0,  0,  1,  0,  0,  1,  0,  1,  0,  0, 14,  1,  0,  0,  0,  0,  0,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 17,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14,  0,  0,  2,  2,  2],
    [ 2,  0,  0,  0,  0,  0,  0, 18,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12, 12,  1, 14,  0,  0,  0,  0,  0,  1,  0,  0, 14,  1,  0, 14,  1,  0,  1,  0,  0,  0,  1,  0,  0,  0,  0, 12,  2,  2,  2,  0,  0,  0, 17,  0,  0,  0,  0,  4,  2,  2, 12, 12, 12,  2,  5,  0,  0,214,  0,  0,  0,  0,  0, 17,  2,  2],
    [ 2,104,104,104,104,104,  2,  2,  2,  2,  2,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,201,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12, 12,  1,  0,  0,  0,  0,  0,  0,  1, 14,  0,  0,  1,  0,  0,  1,  0,  1, 14,  0,  0,  1,  0,  0,  0, 12, 12,  2,  2,  2,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2, 12, 17, 12,  2,  2,  5,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2],
    [ 2, 17,  0,  0, 12,  0,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  1,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  0,  0,  0,  2,  2,135, 12, 12,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0, 14,  1,  0,  0,  1, 14,  1,  0,  0,  0,  1,  0,  0,  0, 12, 12,  2,  2,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  0,  0,  0, 12,  0,  0,  0, 17,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  1,  0,  0,  0,  0,  0, 17,  2,  2,  2,  0,  0,  0,  0,  0,  0,135, 12, 12,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0, 14,  1,  0,  0,  1,  0,  1,  0,  0, 14,  1, 14,  0,  2,  2,  2,  2,  2,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  0,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,214,  0,  0,  0,135, 12, 12,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0,  1, 14,  0,  1,  0,  1, 14,  0,  0,  1,  0,  0,  2,  1,  1,  1,  0,  0,  0,  0,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  5, 12,  0, 12, 12, 12,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  1, 14,  0,  0,  1,  0,  0,  1, 14,  1,  0,  0,  0,  1, 14,  0,  2,  1,301,  1, 14,  0,  0,  0,  2,  2,  2, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0, 17,  0,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  1,  0,  0,  0,  1, 14,  0,  1,  0,  1,  0,  0, 14,  1,  0,  0,  2,  1,  2,  2, 14,  0,  0, 14,  2,  2, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0,  0,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0, 14,  1,  0,  0, 14,  1,  0,  0,  1,  0,  1, 14,  0,  0,  1,  0,  0,  2,  1,  2,  2, 14,  0,  0,  0,  2, 12, 12, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0, 14,  1,  0,  1,  0,  0, 14,  1,  0,  0,  2,  1,  2,  2,  0,  0,  0,  0,130, 12, 12, 12, 12, 12, 12,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,101,101,  2,  2,  2,  2,  2,  0,  1,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  1, 14,  0,  0,  1,  0,  0,  1,  0,  1, 14,  0,  0,  1, 14,  0,  2,  1,  2,  2,  5,  0,  0, 18,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  0,  0, 17,  0,  0,  0,101,101,  2,  2,  2,  2, 17,  0,  1,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  2,  2,  0,  0,  0,  0,  1,  0,  0, 14,  1, 14,  0,  1,  0,  1,  0,  0, 14,  1,  0,  0,  2,  1,  2,  2,  2,  2,  2,119,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  2],
    [ 2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  0, 14,  1,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14,  1, 14,  0,  4,  2,  5,  0,  1, 14,  1,  0,  0,  0,  1,  0,  0,  2,  1,  2,  2,  2,  2,  2,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  0,  4,  2,  2,  2,  2,  2,  2,  2,  0,  0,  1, 14,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0, 14,  2,  2,  0,  0,  0,  4,  2,  5,  0,  1,  0,  4,  2,  2,  2,  2,  2,135,  2,  2,  5,  0,  1,  0,  4,  2,  0,  0,  0,  0,  2,  2,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  2,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  0,  2,  2,  2,  2,  2,  2,  2,  0,  2,  2,  2,  2,  2,  2,  2,  0,  0, 14,  1,  0,  0,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  0, 18,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12,  2,  2,  2,  2,  2,  2,  2,  2,  0,  0,  0, 17,  2,  2,  5,  0,  0,  0,  0,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  1, 14,  0,  0,  2,  2,  2,  2,  2,  0,  0, 12, 12, 12, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12,  2,  2,  2,  2,  2,  2,199,199,199,199, 12, 12,  2,  2,  2,  2,  2,  5,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  2,  2,  2,  0, 17,  0,  0, 17,  0,  0,  1,  0,  0,  0,  2,  2,  2,  0,  0, 12, 12, 12, 12, 17, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12,  2,  2,  2,  2,  2,  2,  0,  0,  0,  0,  0,  0,  2,  2,  2,  2,  2,  2,  0, 14,  1,  0,  0,  0,214,  2,  5,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  0,  0,  0,  0,  0, 18,  0, 12, 12,  2,  2,  2,  0,  0,  0,  0,  0,  0, 14,  1, 12,  0,  0,  0,  0,  0,  0,  0, 12, 12, 12, 12, 12, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  1,199,199, 12,  1,  1,  1,  1,  1,135, 17,  0, 12,199,199,199,  2,  2,  0,  1,  1,  0,  0,  0,  1, 17,  0,  0,214,  2,  2,  0,  0,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  2],
    [ 0,  0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0,  0,  0,  0,  0,  0,  1, 12,  0, 12,  0,  0,  0,  0,  0, 12, 17, 12, 12, 12, 12, 12, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0, 17,  0, 17,  0,  0,  0,  2,  1,  0,  0,  0,  1,  0,  0,  0,214,  2,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  2,  2,  2],
    [ 0,  0,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  5,  0, 12,  0,  0,  0,  1, 12, 12, 12, 12,  0,  0,  0,  0, 12, 12, 12,  0, 12, 12, 17, 12,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 12, 12, 12, 12,  0,  0,  4,  2,  1,  0,  0,  0,  1,  0,  0,  0,214,  2,  2,  5, 18,  0,  0,  4,  2,  2,  2,  2,  2,  2,  2,  2],
    [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2]
]

function importLevelMap() {
    var o;
    
    for (var i = fairies.children.length - 1; i >= 0; i--) {
        objects.removeChild(fairies.children[i].heart);
        fairies.removeChild(fairies.children[i]);
    }

    for (var i = checkpoints.children.length - 1; i >= 0; i--) {
        checkpoints.removeChild(checkpoints.children[i]);
    }

    for (var i = barriers.length - 1; i >= 0; i--) {
        objects.removeChild(barriers[i].icon);
        objects.removeChild(barriers[i].counter);
        barriers.pop();
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
                if (LMC[j][i] >= 100 && LMC[j][i] < 200) {
                    levelMapRow.push(tileType.barrier.id);

                    var tx = (i + 0.5) * levelProperties.grid;
                    var ty = (j + 0.5) * levelProperties.grid;
                    var tbar = {};

                    tbar.strength = LMC[j][i] - 100;
                    tbar.tileX = i;
                    tbar.tileY = j;

                    o = createText("0", tx + 10, ty + 3);
                    o.font.tint = "0xffffff";
                    o.font.size = 32;
                    o.text = tbar.strength;
                    o.anchor.set(0.5, 0.5);
                    objects.addChild(o);
                    tbar.counter = o;

                    o = new PIXI.Sprite(spriteAtlas["heart_new"]);
                    o.x = tx - 14;
                    o.y = ty;
                    o.anchor.set(0.5, 0.5);
                    objects.addChild(o);
                    tbar.icon = o;

                    if (tbar.strength == 99) {
                        tbar.counter.visible = false;
                        tbar.icon.visible = false;
                    }

                    barriers.push(tbar);
                } else if (filterList[LMC[j][i]] == "fairy" || LMC[j][i] >= 200 && LMC[j][i] < 300) {
                    if (LMC[j][i] >= 200) {
                        levelMapRow.push(LMC[j][i] - 200);
                    } else {
                        levelMapRow.push(tileType.air.id);
                    }
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
                    o.verydead = false;
                    fairies.addChild(o);
                } else if (filterList[LMC[j][i]] == "checkpoint" || LMC[j][i] >= 300 && LMC[j][i] < 400) {
                    if (LMC[j][i] >= 200) {
                        levelMapRow.push(LMC[j][i] - 300);
                    } else {
                        levelMapRow.push(tileType.hard_air.id);
                    }
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
            if (levelMap[i][j] == tileType.air.id && levelMap[i][j + 1] == tileType.barrier.id) {
                levelMap[i][j] = tileType.barrier_top.id;
            }
            if (levelMap[i][j] == tileType.wall.id && !tileType.index[levelMap[i][j + 1]].block) {
                var t1, t2;
                if (i > 0) t1 = levelMap[i - 1][j];
                else t1 = tileType.wall.id;
                if (i < levelProperties.gridWidth - 1) t2 = levelMap[i + 1][j];
                else t2 = tileType.wall.id;
/*
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
*/
                if (tileType.index[t1].block && t1 != tileType.ramp_r.id) {
                    if (tileType.index[t2].block && t2 != tileType.ramp_l.id) {
                    } else {
                        levelMap[i][j] = tileType.wall_bottom_r.id;
                    }
                } else {
                    if (tileType.index[t2].block && t2 != tileType.ramp_l.id) {
                        levelMap[i][j] = tileType.wall_bottom_l.id;
                    }
                }
            }
        }
    }
    bossCheckpoint = checkpoints.children.length - 1;

    for (var i = 0; i < fairies.children.length; i++) {
        fairies.children[i].heart = new PIXI.Sprite(spriteAtlas["heart_new"]);
        fairies.children[i].heart.anchor.set(0.5, 0.5);
        fairies.children[i].heart.x = fairies.children[i].x;
        fairies.children[i].heart.y = fairies.children[i].y;
        fairies.children[i].heart.new = true;
        fairies.children[i].heart.visible = false;
        objects.addChild(fairies.children[i].heart);
    }
    killCounter.kills = 0;
    killCounter.num.text = "0/" + fairies.children.length;
}

function reloadMap() {
    var head= document.getElementsByTagName('head')[0];
    var script= document.createElement('script');
    script.src= 'script/levelmap.js';
    head.appendChild(script);
    importLevelMap();
}
