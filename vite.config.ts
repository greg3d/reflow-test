import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [tailwindcss(), react()],
	build: {
	  sourcemap: true, 
	  outDir: 'dist',         
	  minify: false,          
	  rollupOptions: {
		external: ['socket.io', 'http'],
		// If needed, you can specify the input file (note that Vite typically uses index.html as entry)
		// input: 'index.ts',
	  },
	},
	server: {
	  // Vite serves files from the project root by default.
	  // To disable the error overlay (similar to devServer.client.overlay: false)
	  hmr: {
		overlay: false,
	  },
	},
	resolve: {
	  // Vite automatically resolves .ts, .tsx, .js, and .json files,
	  // but you can explicitly include them if desired:
	  extensions: ['.ts', '.tsx', '.js', '.json'],
	},
  });
