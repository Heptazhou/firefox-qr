const $text = document.querySelector("input")
const $qr = document.querySelector(".qr")
const $exports = document.querySelectorAll(".actions a")
const SIZE = 800
const MARGIN = 32

function drawQr(text) {
	const fg = "#2a2a2e"
	const bg = "#f9f9fa"

	const qr = new QRCode({
		content: text || "Hi :)",
		padding: 0,
		color: fg,
		background: bg,
		join: true,
		pretty: false,
		xmlDeclaration: false,
		container: "g",
		width: SIZE,
		height: SIZE,
	}).svg()

	const qr_svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 800 800">\n${qr}\n</svg>\n`
	const qr_png = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="800">\n${qr}\n</svg>\n`

	$qr.innerHTML = qr_svg
	$exports[0].href = `data:image/svg+xml;base64,${btoa(qr_svg)}`

	const $img = new Image()
	$img.src = `data:image/svg+xml;base64,${btoa(qr_png)}`
	$img.addEventListener("load", function () {
		const $canvas = document.createElement("canvas")
		$canvas.width = this.width + 2 * MARGIN
		$canvas.height = this.height + 2 * MARGIN

		const $ctx = $canvas.getContext("2d")
		$ctx.fillStyle = "#ffffff"
		$ctx.fillRect(0, 0, $canvas.width, $canvas.height)
		$ctx.drawImage(this, MARGIN, MARGIN)
		$exports[1].href = $canvas.toDataURL()
	})
}

browser.tabs.query({ currentWindow: true, active: true }).then((tabInfo) => {
	const url = tabInfo[0].url
	$text.value = url
	drawQr(url)
}, console.log)

$text.addEventListener("input", function () {
	drawQr(this.value)
})

$text.addEventListener("focus", function () {
	this.select()
})
