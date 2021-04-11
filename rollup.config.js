import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
	input: "src/main.js",
	output: [
		{
			file: "build/bundle.js",
			format: "cjs",
		},
		{
			file: "build/bundle.min.js",
			format: "iife",
			name: "version",
			plugins: [terser()],
		},
	],
	plugins: [
		json(),
		babel({
			babelHelpers: "bundled",
		}),
	],
};
