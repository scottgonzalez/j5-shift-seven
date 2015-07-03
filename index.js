var five = require("johnny-five");

module.exports = ShiftSeven;

var numbers = {
	0: "11111100",
	1: "01100000",
	2: "11011010",
	3: "11110010",
	4: "01100110",
	5: "10110110",
	6: "10111110",
	7: "11100000",
	8: "11111110",
	9: "11110110",
};

// Right-pad `string` with `char`
function pad(string, length, char) {
	while (string.length < length) {
		string = char + string;
	}

	return string;
}

function ShiftSeven(options) {
	this.register = new five.ShiftRegister(options);
}

ShiftSeven.prototype.draw = function(number) {
	this.write(numbers[number]);
};

ShiftSeven.prototype.write = function(value) {

	// Convert numbers to 8-bit binary strings
	if (typeof value === "number") {
		value = pad(value.toString(2), 8, "0");
	}

	// Reverse the binary string so the shit register gets the values
	// in the correct order
	value = value.split("").reverse().join("");
	value = parseInt(value, 2);

	this.register.send(value);
};

ShiftSeven.prototype.off = function() {
	this.write(0);
};



ShiftSeven.Multi = function(options) {
	this.leadingZeros = options.leadingZeros || false;

	this.displays = options.displays.map(function(displayOptions) {
		return new ShiftSeven(displayOptions);
	});
};

ShiftSeven.Multi.prototype.draw = function(value) {
	value = pad(value.toString(), this.displays.length, this.leadingZeros ? "0" : " ");

	value.split("").forEach(function(value, index) {
		if (value === " ") {
			this.displays[index].off();
		} else {
			this.displays[index].draw(value);
		}
	}, this);
};

ShiftSeven.Multi.prototype.off = function() {
	this.displays.forEach(function(display) {
		display.off();
	});
};
