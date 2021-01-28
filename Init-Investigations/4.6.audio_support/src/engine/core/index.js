import * as core from './core.js'
import * as gl from './gl.js'
import * as input from './input.js'
import * as loop from './loop.js'
import * as vertexbuffer from './vertex_buffer.js'

export default {gl, input, loop, vertexbuffer, ...core}  // ...core to avoid core.core calls