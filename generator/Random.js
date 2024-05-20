class UInt48 {

	constructor(n) {
		if (n instanceof UInt48) {
			Object.assign(this, n);
		} else if (typeof n === 'number') {
			let w0 = n & 0xffff;
			n /= 0x10000;
			let w1 = n & 0xffff;
			n /= 0x10000;
			let w2 = n & 0xffff;
			Object.assign(this, { w2, w1, w0 });
		}
	}

	norm() {
		if (this.w0 >= 0x10000) {
			let carry = Math.floor(this.w0 / 0x10000);
			this.w1 += carry;
			this.w0 &= 0xffff;
		}
		if (this.w1 >= 0x10000) {
			let carry = Math.floor(this.w1 / 0x10000);
			this.w2 += carry;
			this.w1 &= 0xffff;
		}
		this.w2 &= 0xffff;

		return this;
	}

	add(n) {
		let tmp = new UInt48(this);

		tmp.w0 += n.w0;
		tmp.w1 += n.w1;
		tmp.w2 += n.w2;

		return tmp.norm();
	}

	xor(n) {
		let tmp = new UInt48(this);

		tmp.w2 ^= n.w2;
		tmp.w1 ^= n.w1;
		tmp.w0 ^= n.w0;

		return tmp;
	}

	mul(n) {
		let tmp1 = new UInt48(n);
		tmp1.w2 = tmp1.w2 * this.w0;
		tmp1.w1 = tmp1.w1 * this.w0;
		tmp1.w0 = tmp1.w0 * this.w0;
		tmp1.norm();

		let tmp2 = new UInt48(n);
		tmp2.w2 = tmp2.w1 * this.w1;
		tmp2.w1 = tmp2.w0 * this.w1;
		tmp2.w0 = 0;
		tmp2.norm();

		let tmp3 = new UInt48(n);
		tmp3.w2 = tmp3.w0 * this.w2;
		tmp3.w1 = 0;
		tmp3.w0 = 0;
		tmp3.norm();

		return tmp3.add(tmp2).add(tmp1);
	}

	valueOf() {
		return 0x10000 * (0x10000 * this.w2 + this.w1) + this.w0;
	}
}

class Random {

    static multiplier = new UInt48(0x5DEECE66D);
    static addend = new UInt48(0xB);
    static mask = (1 << 48) - 1;

	constructor(seed = Date.now()) {
		this.seed = new UInt48(seed).xor(Random.multiplier);//(seed ^ Random.multiplier) & Random.mask;
	}

    next(bits) {
		this.seed = this.seed.mul(Random.multiplier).add(Random.addend);
		// console.log(this.seed);
		return (this.seed / 0x10000) >> (32 - bits);
        // let oldseed;
        // let nextseed;
        // let seed = this.seed;
        // do {
        //     oldseed = seed.get();
        //     nextseed = (oldseed * Random.multiplier + Random.addend) & Random.mask;
        // } while (!seed.compareAndSet(oldseed, nextseed));

        // return (nextseed >>> (48 - bits));
    }

	nextLong() {
		if(arguments.length == 0) return this.next(64);
	}

	nextInt() {
		if(arguments.length == 0) return this.next(32);
		if(arguments.length == 1) {
			let bound = arguments[0];
        	const m = bound - 1;
        	let r = this.next(32);
        	if ((bound & m) == 0) {
        	    // The bound is a power of 2.
        	    r &= m;
        	} else {
        	    // Must reject over-represented candidates
        	    for (let u = r >>> 1;
        	         u + m - (r = u % bound) < 0;
        	         u = this.next(32) >>> 1);
        	}
        	return r;
		}
		if(arguments.length == 2) {
			let origin = Math.min(arguments[0], arguments[1]);
			let bound = Math.max(arguments[0], arguments[1]);
        	let r = this.next(32);
        	if (origin < bound) {
        	    // It's not case (1).
        	    const n = bound - origin;
        	    const m = n - 1;
        	    if ((n & m) == 0) {
        	        // It is case (2): length of range is a power of 2.
        	        r = (r & m) + origin;
        	    } else if (n > 0) {
        	        // It is case (3): need to reject over-represented candidates.
        	        for (let u = r >>> 1;
        	             u + m - (r = u % n) < 0;
        	             u = this.next(32) >>> 1)
        	            ;
        	        r += origin;
        	    } else {
        	        // It is case (4): length of range not representable as long.
        	        while (r < origin || r >= bound) {
        	            r = this.next(32);
        	        }
        	    }
        	}
        	return r;
		}
	}

	nextFloat() {
		if(arguments.length == 0) return (this.nextInt() >>> 8) * 5.9604645E-8;
		if(arguments.length == 2) {
        	let r = this.nextFloat();
        	let origin = arguments[0];
        	let bound = arguments[1];
        	return r*(bound-origin) + origin;
		}
		if(arguments.length == 1) {
        	let r = this.nextFloat();//(this.nextInt()+0x7fffffff) / 0xffffffff;//this.nextFloat();
        	let bound = arguments[0];
        	return r*bound;
		}
	}

    nextBoolean() {
        return this.next(1) != 0;
    }
}