import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
// import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        base: '/',
        port: 5173,
        // https: {
        //     key: fs.readFileSync("C:/Users/shakt/ca-certs/localhost/localhost-key.pem"),
        //     cert: fs.readFileSync("C:/Users/shakt/ca-certs/localhost/localhost.pem"),
        // }
    },
    define: {
        global: "globalThis",
    },
})
