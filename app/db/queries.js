module.exports = {

	"counts.create": [
		" CREATE TABLE ",
		" IF NOT EXISTS COUNTS (KEY TEXT, VALUE INTEGER)"
	],

	"counts.insert": [
		" INSERT INTO COUNTS (KEY, VALUE)",
		" VALUES (?, ?)"
	],

	"counts.update": [
		" UPDATE COUNTS ",
		" SET VALUE = VALUE + 1 WHERE KEY = ?"
	],

	"counts.value": [
		"SELECT VALUE FROM COUNTS"
	],

	"counts.all": [
		"SELECT * FROM COUNTS"
	]
};