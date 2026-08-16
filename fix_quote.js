const fs = require('fs');
let data = fs.readFileSync('i18n_dict.js', 'utf8');
data = data.replace('пам\\'яті', 'пам\\\\\\'яті');
fs.writeFileSync('i18n_dict.js', data);
