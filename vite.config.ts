import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    https: {
      key: fs.readFileSync("./cert/localhost-key.pem"),
      cert: fs.readFileSync("./cert/localhost.pem"),
    },
  },
});
