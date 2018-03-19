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
import Fileformat from 'SDK/API/Fileformat'
import SlyeTemplate from 'SDK/classes/SlyeTemplate'
import tmp from 'tmp'
import tar from 'tar'
import mkdirp from 'mkdirp'
import path from 'path'
import fs from 'fs'
import fstream from 'fstream'
import UUID from 'uuid/v4'
import {dialog} from 'electron'

const Router = Express.Router()

// [/tmp/]slye_xxxx -> /path/to/file.sly
let TMP2File	= {}
let UUID2TMP	= {}

let template	= new SlyeTemplate()

Router.post('/create', function(req, res, next){
	// create an empty presentation
	Fileformat.init()

	global.__presentation__.template		= template
	global.__presentation__.template.name	= req.body.template
	global.__presentation__.meta			= {
		createdAt	: Math.floor(Date.now() / 1000)
	,	title		: req.body.title
	,	description	: req.body.description
	}
	global.__presentation__.configs.palette = '#69d2e7,#a7dbd8,#e0e4cc,#f38630,#fa6900'

	let stepUUID = Fileformat.Steps.createStep()
	Fileformat.Path.add2Path(stepUUID)

	let data = Fileformat.toJSON()
	global.__presentation__	= null

	// creat a temp directory
	let tmpDir	= tmp.dirSync({prefix: 'slye_' }).name
	mkdirp(path.resolve(tmpDir, 'assets'))

	fs.writeFile(path.resolve(tmpDir, 'slye.json'), data, () => {
		let uuid = UUID()
		UUID2TMP[uuid] = tmpDir
		console.log(tmpDir)
		res.send({
			uuid: uuid
		})
	})
})

Router.post('/open', function(req, res, next){
	// req.body.path
})

function save(dir, fileName){
	var dist = fs.createWriteStream(fileName)
	tar.c({
		gzip: true,
		cwd: dir
	}, ['assets', 'slye.json']).pipe(dist)
}

Router.post('/:uuid/save', function(req, res, next){
	let uuid	= req.params.uuid
	let data	= JSON.parse(req.body.data)
	fs.writeFile(path.resolve(UUID2TMP[uuid], 'slye.json'), req.body.data, () => {
		if(!TMP2File[UUID2TMP[uuid]]){
			dialog.showSaveDialog({
				title: 'Save - ' + data.meta.title,
				defaultPath: data.meta.title.toLowerCase().replace(/^\s+|\s+$/g,'').replace(/\s+/g, '-'),
				filters: [
					{name: 'Slye presentation file', extensions: ['sly']},
				]
			}, function(filepath){
				if(filepath){
					TMP2File[UUID2TMP[uuid]] = filepath

					let a = req.configs.get('history') || []
					a.push({
						file: filepath
					,	uuid: uuid
					})
					req.configs.set('history', a)

					save(UUID2TMP[uuid], TMP2File[UUID2TMP[uuid]])
				}
			})
		}else{
			save(UUID2TMP[uuid], TMP2File[UUID2TMP[uuid]])
		}
	})
	res.send({status: 'code'})
})

Router.post('/:uuid/template', function(req, res, next){

})

Router.get('/:uuid/slye.json', function(req, res, next){
	fs.createReadStream(
		path.resolve(UUID2TMP[req.params.uuid], 'slye.json')
	).pipe(res)
})

Router.post('/:uuid/thumb', function(req, res, next){

})

Router.post('/:uuid/upload', function(req, res, next){

})

Router.get('/:uuid/assets/:fileUUID', function(req, res, next){

})

export default Router
