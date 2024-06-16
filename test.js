let text = `
Fyzika 85.3%
Erika Ockova

9.5/11 m,5/5m,7/8m,85/13 wm, 11.5/ 14 m,
1/0m,1/0m
`;

let pattern = /\b\d+\/\d+(\.\d+)?(?![\d\/])/g;
let grades = text.match(pattern);

console.log(grades);
