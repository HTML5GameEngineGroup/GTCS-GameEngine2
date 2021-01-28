/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import * as audio from './Core/Resources/Engine_AudioClips.js'
import * as defaultResources from './Core/Resources/Engine_DefaultResources.js'
import * as input from './Core/Engine_Input.js'
import * as core from './Core/Engine_Core.js'
import * as loop from './Core/Engine_GameLoop.js'

// Engine utility stuff
import Camera from './Camera.js'
import Scene from './Scene.js'
import Transform from './Transform.js'
import SimpleShader from './SimpleShader.js'
import Renderable from './Renderable.js'

export default {audio, defaultResources, input, core, loop,
            Camera : Camera, 
            Scene: Scene, 
            Transform : Transform, 
            SimpleShader : SimpleShader, 
            Renderable : Renderable};
