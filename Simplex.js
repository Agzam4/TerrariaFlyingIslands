class Simplex {

	static grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];

	static noise2d(seed, octaves, persistence, scale, x, y) {
		let total = 0;
        let frequency = scale;
        let amplitude = 1;

        let maxAmplitude = 0;

        for(var i = 0; i < octaves; i++){
            total += (Simplex.raw2d(seed, x * frequency, y * frequency) + 1) / 2 * amplitude;
            frequency *= 2;
            maxAmplitude += amplitude;
            amplitude *= persistence;
        }

        return total / maxAmplitude;
	}

	 static raw2d(seed, x, y){
        let n0, n1, n2;

        let F2 = 0.5 * (Math.sqrt(3.0) - 1.0);

        let s = (x + y) * F2;
        let i = Mathf.floor(x + s);
        let j = Mathf.floor(y + s);

        let G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        let t = (i + j) * G2;
        // Unskew the cell origin back to (x,y) space
        let X0 = i - t;
        let Y0 = j - t;
        // The x,y distances from the cell origin
        let x0 = x - X0;
        let y0 = y - Y0;

        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if(x0 > y0){
            i1 = 1;
            j1 = 0;
        } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        else{
            i1 = 0;
            j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)

        let x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
        let y2 = y0 - 1.0 + 2.0 * G2;
        let ii = i & 255;
        let jj = j & 255;
        let gi0 = Simplex.perm(seed, ii + Simplex.perm(seed, jj)) % 12;
        let gi1 = Simplex.perm(seed, ii + i1 + Simplex.perm(seed, jj + j1)) % 12;
        let gi2 = Simplex.perm(seed, ii + 1 + Simplex.perm(seed, jj + 1)) % 12;
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if(t0 < 0) n0 = 0.0;
        else{
            t0 *= t0;
            n0 = t0 * t0 * Simplex.dot(Simplex.grad3[gi0], x0, y0); // (x,y) of grad3 used for 2D gradient
        }

        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if(t1 < 0) n1 = 0.0;
        else{
            t1 *= t1;
            n1 = t1 * t1 * Simplex.dot(Simplex.grad3[gi1], x1, y1);
        }

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if(t2 < 0) n2 = 0.0;
        else{
            t2 *= t2;
            n2 = t2 * t2 * Simplex.dot(Simplex.grad3[gi2], x2, y2);
        }
        return 70.0 * (n0 + n1 + n2);
    }


    static perm(seed, x){
        x = ((x >>> 16) ^ x) * 0x45d9f3b;
        x = ((x >>> 16) ^ x) * (0x45d9f3b + seed);
        x = (x >>> 16) ^ x;
        return x & 0xff;
    }


    static dot(g, x, y){
        return g[0] * x + g[1] * y;
    }

}