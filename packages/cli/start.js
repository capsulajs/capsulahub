const { exec } = require('child_process');

console.log('in start');
exec(`
top &
echo $!
`);
