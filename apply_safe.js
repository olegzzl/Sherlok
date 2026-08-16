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

const finalScript = \`
<script>
\` + scriptContent + \`

function setLang(lang) {
  localStorage.setItem('sherlock_lang', lang);
  
  // Update buttons
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    if (btn.getAttribute('data-lang-btn') === lang) {
      btn.classList.add('text-white', 'font-bold');
      btn.classList.remove('text-sherlock-gold-dark');
    } else {
      btn.classList.remove('text-white', 'font-bold');
      btn.classList.add('text-sherlock-gold-dark');
    }
  });

  // Update texts
  const dict = translations[lang];
  if(!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });
  
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key]) {
      el.title = dict[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('sherlock_lang') || 'ru';
  setLang(savedLang);
});
</script>
\`;

content = content.replace('</body>', finalScript + '</body>');

if (!errorFound) {
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log("i18n applied correctly via JS regex");
} else {
  console.log("ERRORS FOUND - NO WRITE");
}
