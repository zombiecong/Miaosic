/**
 * Created by congchen on 1/18/17.
 */

const Encoder = require('node-html-encoder').Encoder;
const encoder = new Encoder('entity');


const code = '&#50640;&#51060;&#54609;&#53356;';

let singer = encoder.htmlDecode(code);

console.log(singer)
