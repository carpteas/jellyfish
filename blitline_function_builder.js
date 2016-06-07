var resize = {
  name: 'resize',
  params: { width: 720, height: 540 },
  save: { image_identifier: 'demo' }
}

var watermark = {
  name: 'watermark',
  params: { text: 'jellyfish' },
  save: { image_identifier: 'demo' }
}

var line4 = {
  name: 'line',
  params: { x: 710, y: 530, x1: 610, y1: 430, width: 4, opacity: 0.5 },
  functions: [watermark]
}

var line3 = {
  name: 'line',
  params: { x: 10, y: 530, x1: 100, y1: 430, width: 4, opacity: 0.5 },
  functions: [line4]
}

var line2 = {
  name: 'line',
  params: { x: 710, y: 10, x1: 610, y1: 100, width: 4, opacity: 0.5 },
  functions: [line3]
}

var line1 = {
  name: 'line',
  params: { x: 10, y: 10, x1: 100, y1: 100, width: 4, opacity: 0.5 },
  functions: [line2]
}

var functions = line1;

console.log('--------------');

var normal = JSON.stringify(functions);
console.log(normal);

var encoded = encodeURIComponent(normal);
console.log(encoded);
// %5B%7B%22name%22%3A%22line%22%2C%22params%22%3A%7B%22x%22%3A10%2C%22y%22%3A10%2C%22x1%22%3A100%2C%22y1%22%3A100%2C%22width%22%3A4%2C%22opacity%22%3A0.5%7D%2C%22functions%22%3A%5B%7B%22name%22%3A%22line%22%2C%22params%22%3A%7B%22x%22%3A710%2C%22y%22%3A10%2C%22x1%22%3A610%2C%22y1%22%3A100%2C%22width%22%3A4%2C%22opacity%22%3A0.5%7D%2C%22functions%22%3A%5B%7B%22name%22%3A%22line%22%2C%22params%22%3A%7B%22x%22%3A10%2C%22y%22%3A530%2C%22x1%22%3A100%2C%22y1%22%3A430%2C%22width%22%3A4%2C%22opacity%22%3A0.5%7D%2C%22functions%22%3A%5B%7B%22name%22%3A%22line%22%2C%22params%22%3A%7B%22x%22%3A710%2C%22y%22%3A530%2C%22x1%22%3A610%2C%22y1%22%3A430%2C%22width%22%3A4%2C%22opacity%22%3A0.5%7D%2C%22functions%22%3A%5B%7B%22name%22%3A%22watermark%22%2C%22params%22%3A%7B%22text%22%3A%22jellyfish%20trademark%202016%22%7D%2C%22save%22%3A%7B%22image_identifier%22%3A%22hsifyllej%22%7D%7D%5D%7D%5D%7D%5D%7D%5D%7D%5D

var decoded = decodeURIComponent(encoded);
console.log(decoded);

console.log('--------------');