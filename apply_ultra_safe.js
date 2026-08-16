const fs = require('fs');

const filepath = 'd:/Insta Sites/Scherlock Holmes/code.html';
let content = fs.readFileSync(filepath, 'utf-8');

const dictObj = require('./i18n_dict.js');
const replacements = JSON.parse(fs.readFileSync('./replacements.json', 'utf-8'));

let errorFound = false;
replacements.forEach(r => {
  if (content.includes(r.old)) {
    content = content.replace(new RegExp(r.old.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), r.new);
  } else {
    console.warn("NOT FOUND: ", r.old);
    errorFound = true;
  }
});

const scriptContent = fs.readFileSync('./i18n_dict.js', 'utf-8').replace('module.exports =', 'const translations =');

const finalScript = "<script>\n" +
scriptContent + "\n" +
"function setLang(lang) {\n" +
"  localStorage.setItem('sherlock_lang', lang);\n" +
"  document.querySelectorAll('[data-lang-btn]').forEach(btn => {\n" +
"    if (btn.getAttribute('data-lang-btn') === lang) {\n" +
"      btn.classList.add('text-white', 'font-bold');\n" +
"      btn.classList.remove('text-sherlock-gold-dark');\n" +
"    } else {\n" +
"      btn.classList.remove('text-white', 'font-bold');\n" +
"      btn.classList.add('text-sherlock-gold-dark');\n" +
"    }\n" +
"  });\n" +
"  const dict = translations[lang];\n" +
"  if(!dict) return;\n" +
"  document.querySelectorAll('[data-i18n]').forEach(el => {\n" +
"    const key = el.getAttribute('data-i18n');\n" +
"    if (dict[key]) {\n" +
"      el.innerHTML = dict[key];\n" +
"    }\n" +
"  });\n" +
"  document.querySelectorAll('[data-i18n-ph]').forEach(el => {\n" +
"    const key = el.getAttribute('data-i18n-ph');\n" +
"    if (dict[key]) {\n" +
"      el.placeholder = dict[key];\n" +
"    }\n" +
"  });\n" +
"  document.querySelectorAll('[data-i18n-title]').forEach(el => {\n" +
"    const key = el.getAttribute('data-i18n-title');\n" +
"    if (dict[key]) {\n" +
"      el.title = dict[key];\n" +
"    }\n" +
"  });\n" +
"}\n" +
"document.addEventListener('DOMContentLoaded', () => {\n" +
"  const savedLang = localStorage.getItem('sherlock_lang') || 'ru';\n" +
"  setLang(savedLang);\n" +
"});\n" +
"</script>\n";

content = content.replace('</body>', finalScript + '</body>');

if (!errorFound) {
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log("i18n applied correctly via JS regex");
} else {
  console.log("ERRORS FOUND - NO WRITE");
}
