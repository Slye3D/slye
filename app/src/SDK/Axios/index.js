/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2017 Slye Development Team. All Rights Reserved.
 *       Licence: MIT License
 */

import Axios from 'axios'

Axios.defaults.baseURL = 'http://127.0.0.1:63985/'
Axios.defaults.withCredentials = true

export default Axios
