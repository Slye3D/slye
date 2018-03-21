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

import Express from 'express';
import Fileformat from 'SDK/API/Fileformat';
import SlyeTemplate from 'SDK/classes/SlyeTemplate';
import tmp from 'tmp';
import tar from 'tar';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';
import fstream from 'fstream';
import UUID from 'uuid/v4';
import { dialog } from 'electron';

const Router = Express.Router();

// [/tmp/]slye_xxxx -> /path/to/file.sly
const TMP2File	= {};
const UUID2TMP	= {};

const template	= new SlyeTemplate();

Router.post('/create', (req, res, next) => {
	// create an empty presentation
  Fileformat.init();

  global.__presentation__.template		= template;
  global.__presentation__.template.name	= req.body.template;
  global.__presentation__.meta			= {
    createdAt: Math.floor(Date.now() / 1000),
    title: req.body.title,
    description: req.body.description
  };
  global.__presentation__.configs.palette = '#69d2e7,#a7dbd8,#e0e4cc,#f38630,#fa6900';

  const stepUUID = Fileformat.Steps.createStep();
  Fileformat.Path.add2Path(stepUUID);

  const data = Fileformat.toJSON();
  global.__presentation__	= null;

	// creat a temp directory
  const tmpDir	= tmp.dirSync({ prefix: 'slye_' }).name;
  mkdirp(path.resolve(tmpDir, 'assets'));

  fs.writeFile(path.resolve(tmpDir, 'slye.json'), data, () => {
    const uuid = UUID();
    UUID2TMP[uuid] = tmpDir;
    console.log(tmpDir);
    res.send({
      uuid
    });
  });
});

Router.post('/open', (req, res, next) => {
	// req.body.path
});

function save(dir, fileName) {
  const dist = fs.createWriteStream(fileName);
  tar.c({
    gzip: true,
    cwd: dir
  }, ['assets', 'slye.json']).pipe(dist);
}

Router.post('/:uuid/save', (req, res, next) => {
  const uuid	= req.params.uuid;
  const data	= JSON.parse(req.body.data);
  fs.writeFile(path.resolve(UUID2TMP[uuid], 'slye.json'), req.body.data, () => {
    if (!TMP2File[UUID2TMP[uuid]]) {
      dialog.showSaveDialog({
        title: `Save - ${data.meta.title}`,
        defaultPath: data.meta.title.toLowerCase().replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-'),
        filters: [
					{ name: 'Slye presentation file', extensions: ['sly'] },
        ]
      }, (filepath) => {
        if (filepath) {
          TMP2File[UUID2TMP[uuid]] = filepath;

          const a = req.configs.get('history') || [];
          a.push({
            file: filepath,
            uuid
          });
          req.configs.set('history', a);

          save(UUID2TMP[uuid], TMP2File[UUID2TMP[uuid]]);
        }
      });
    } else {
      save(UUID2TMP[uuid], TMP2File[UUID2TMP[uuid]]);
    }
  });
  res.send({ status: 'code' });
});

Router.post('/:uuid/template', (req, res, next) => {

});

Router.get('/:uuid/slye.json', (req, res, next) => {
  fs.createReadStream(
		path.resolve(UUID2TMP[req.params.uuid], 'slye.json')
	).pipe(res);
});

Router.post('/:uuid/thumb', (req, res, next) => {

});

Router.post('/:uuid/upload', (req, res, next) => {

});

Router.get('/:uuid/assets/:fileUUID', (req, res, next) => {

});

export default Router;
