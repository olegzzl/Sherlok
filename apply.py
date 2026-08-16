import json
import os

with open('replacements.json', 'r', encoding='utf-8') as f:
    replacements = json.load(f)

with open('i18n_dict.js', 'r', encoding='utf-8') as f:
    dict_content = f.read().replace('module.exports = ', 'const translations = ').replace(';\n', ';\n')

filepath = 'code.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

for r in replacements:
    if r['old'] in content:
        content = content.replace(r['old'], r['new'])
    else:
        print("NOT FOUND:", r['old'])

script_str = f"""
<script>
{dict_content}

function setLang(lang) {{
  localStorage.setItem('sherlock_lang', lang);
  
  // Update buttons
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {{
    if (btn.getAttribute('data-lang-btn') === lang) {{
      btn.classList.add('text-white', 'font-bold');
      btn.classList.remove('text-sherlock-gold-dark');
    }} else {{
      btn.classList.remove('text-white', 'font-bold');
      btn.classList.add('text-sherlock-gold-dark');
    }}
  }});

  // Update texts
  const dict = translations[lang];
  if(!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {{
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {{
      el.innerHTML = dict[key];
    }}
  }});
  
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {{
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key]) {{
      el.placeholder = dict[key];
    }}
  }});

  document.querySelectorAll('[data-i18n-title]').forEach(el => {{
    const key = el.getAttribute('data-i18n-title');
    if (dict[key]) {{
      el.title = dict[key];
    }}
  }});
}}

document.addEventListener('DOMContentLoaded', () => {{
  const savedLang = localStorage.getItem('sherlock_lang') || 'ru';
  setLang(savedLang);
}});
</script>
"""

content = content.replace('</body>', script_str + '</body>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("i18n applied correctly via Python")
