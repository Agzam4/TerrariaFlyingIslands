class BinaryWriter {

	static chunkSize = 2048;
	static utf8 = new TextEncoder('UTF-8');

	constructor(name = "world.wld") {
		this.name = name;
		this.buffer = new Uint8Array(0);
		this.index = 0;
		this.size = 0;
	}

	out(b) {
		if(this.index >= this.buffer.length) {
			let resize = new Uint8Array(this.buffer.length + BinaryWriter.chunkSize);
			for (var i = 0; i < this.buffer.length; i++) {
				resize[i] = this.buffer[i];
			}
			this.buffer = resize;
		}
		this.buffer[this.index++] = b;
		this.size = Math.max(this.size, this.index);
	}

	bool(b) {
		this.out(b?1:0);
	}

	int16(int16) {
		this.out(int16 >> 0);
		this.out(int16 >> 8);
	}

	int32(int32) {
		this.out(int32 >> 0);
		this.out(int32 >> 8);
		this.out(int32 >> 16);
		this.out(int32 >> 24);
	}

	int64(int64) {
		let pre = Math.floor(int64/2**32);
		this.out(pre >>> 24);
		this.out(pre << 8 >>> 24);
		this.out(pre << 16 >>> 24);
		this.out(pre << 24 >>> 24);
		this.out(int64 >>> 24);
		this.out(int64 << 8 >>> 24);
		this.out(int64 << 16 >>> 24);
		this.out(int64 << 24 >>> 24);
	}

	float(float) {
    	var buffer = new ArrayBuffer(4);        
    	var longNum = new Float32Array(buffer); 
	
    	longNum[0] = float;
		
		for (var i of Array.from(new Int8Array(buffer))) {
            this.out(i);
		}
	}


	double(double) {
    	var buffer = new ArrayBuffer(8);       
    	var longNum = new Float64Array(buffer);
	
    	longNum[0] = double;
		
		for (var i of Array.from(new Int8Array(buffer))) {
            this.out(i);
		}
	}

	write7BitEncodedInt(value) {
        while (value >= 0x80) {
            this.out(value | 0x80);
            value >>= 7;
        }
        this.out(value);
	}

	string(string) {
		let bytes = BinaryWriter.utf8.encode(string);

		this.write7BitEncodedInt(bytes.length);
		for (var i = 0; i < bytes.length; i++) {
			this.out(bytes[i]);
		}
		// for (var i = 0; i < bytes.length; i++) {
			// this.out(string.charCodeAt(i)); //  & 0xFF
			// this.int16(string.charCodeAt(i)); //  & 0xFF
		// }
	}

	bytes(bytes, from = 0, length = undefined) {
		if(length == undefined) length = bytes.length;
		for (var i = 0; i < length; i++) {
			this.out(bytes[from+i]);
		}
	}

	bytesFrom(bytes, from, length) {
		// console.log(`Bytes ${from + this.index} to ${from+length + this.index}`);
		for (var i = 0; i < length; i++) {
			this.out(bytes[from+i]);
		}
	}

	chars(string) {
		for (var i = 0; i < string.length; i++) {
			this.out(string.charCodeAt(i));
		}
	}

	flush() {
		let bytes = new Uint8Array(this.size);
		for (var i = 0; i < bytes.length; i++) {
			bytes[i] = this.buffer[i];
		}
		// var blob = new Blob([bytes], {type: "mimeType"});// change resultByte to bytes
		// var link = document.createElement('a');
		// link.href = window.URL.createObjectURL(blob);
		// link.download = this.name;
		// link.click();
		var blob = new Blob([bytes], {type: "mimeType"});// change resultByte to bytes
        self.postMessage({name:"download-link", link:URL.createObjectURL(blob)});
	}
}