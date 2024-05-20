class Mathf {

   	static radiansToDegrees = 57.29577951308232;
   	static degreesToRadians = 0.017453292519943295;
	static pi = Math.PI;
	static pi2 = Math.PI*2;

	static toRadians(angle) {
		return angle * Mathf.degreesToRadians;
	}
	
	static toDegrees(angle) {
		return angle * Mathf.radiansToDegrees;
	}
	

	static cos(rad) {
		return Math.cos(rad);
	}
	
	static sin(rad) {
		return Math.sin(rad);
	}

	static ilerp(value, target, time) {
		return Mathf.floor((value-target)*time + target);
	}

	static floor(value) {
		return Math.floor(value);
	}

	static ceil(value) {
		return Math.ceil(value);
	}

	static hypot2(dx, dy) {
		return dx*dx + dy*dy;
	}

	static clamp(value, min, max) {
		if(value < min) return min;
		if(value > max) return max;
		return value;
	}

	static angle(x, y) {
		return Math.atan2(y, x);
	}
}