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

import Express from 'express'
import HTTP from 'http'
import BodyParser from 'body-parser'
import Store from 'electron-config'
import Router from './router'

const 	App		= Express()
,		Server	= HTTP.Server(App)
,		Configs	= new Store({
	encryptionKey: '!Qti3e@Slye!'
})

App.set('configs', Configs)

App.use(BodyParser.urlencoded({ extended: false }))
App.use(BodyParser.json())
App.use(Router)

App.all('*', function(req, res, next){
	res.status(404).send('Not found!')
})

export default Server
