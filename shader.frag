#version 330 core
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D tex;

out vec4 fragColor;

// By Dan Printzell <github vild io>
// License: MPLv2

#define PATTERN_COLOR 0
#define PATTERN_GRAY 1

#define PATTERN PATTERN_COLOR

const float d = 8.0;
#if PATTERN == PATTERN_COLOR
const vec4 offsetMove = vec4(4, 2, 32, 0);
const float hasStarRatio = 0.78;
const float blinkRatio   = 0.88;
#else
const vec4 offsetMove = vec4(4, 2, 16, 0);
const float hasStarRatio = 0;
const float blinkRatio   = 0.8;
#endif
const float blinkSpeed   = 0.9;
vec2 offset;
float x;
float y;
float rx;
float ry;
float randRes;

vec2 seed;

float rand();

float hasStar() {
	if (randRes > hasStarRatio) {
		float cx = rx * d;
		float cy = ry * d;

		float r = sqrt(pow(x - cx, 2.0) + pow(y - cy, 2.0));
		return 1.0 - ((r * 2.0) / d);
	}
	return 0.0;
}

vec4 starColor() {
#if PATTERN == PATTERN_COLOR
	return vec4(
		abs(mod(y - x, 255.0)) / 255.0,
		abs(mod(x + y, 255.0)) / 255.0,
		abs(mod(x - y, 255.0)) / 255.0,
		1.0
	) * 1.5;
#else
	return vec4(
							rand(),
							rand(),
							rand(),
							1.0
	);
#endif
}

float blink() {
	if (randRes > blinkRatio)
		return sin(randRes/3.0+(offset.x+offset.y+gl_FragCoord.x)*blinkSpeed/d)/2.0 + 0.5;
	return 1.0;
}

void main() {
	offset = vec2(time * offsetMove.x + sin(time * offsetMove.y), time * offsetMove.z + sin(time * offsetMove.w));
	x = floor(offset.x + gl_FragCoord.x + 0.5);
	y = floor(offset.y + gl_FragCoord.y + 0.5);
	rx = floor(x / d + 0.5);
	ry = floor(y / d + 0.5);
	seed = vec2(rx, ry);
	randRes = rand();
	vec4 result = starColor() * hasStar() * blink();
	fragColor = result;
}

float PHI = 1.61803398874989484820459 * 00000.1; // Golden Ratio
float PI  = 3.14159265358979323846264 * 00000.1; // PI
float SRT = 1.41421356237309504880169 * 10000.0; // Square Root of Two


// Gold Noise function
//
float gold_noise(in vec2 coordinate, in float seed) {
	return fract(sin(dot(coordinate*seed, vec2(PHI, PI)))*SRT);
}

float rand() {
	return gold_noise(seed, 13.37) * gold_noise(seed, 73.31);
}
