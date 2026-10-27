const fs = require('fs')
const html = fs.readFileSync('public/ui-film.html', 'utf8')
const start = html.indexOf('<script>')
const end = html.lastIndexOf('</script>')
if (start < 0 || end < 0) throw new Error('no script')
const code = html.slice(start + '<script>'.length, end)
fs.writeFileSync('film/_check.js', code)
require('child_process').execSync('node --check film/_check.js', {
	stdio: 'inherit',
})
fs.unlinkSync('film/_check.js')
fs.unlinkSync('film/_check-run.js')
