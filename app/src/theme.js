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


 import getMuiTheme from 'material-ui/styles/getMuiTheme';
 import { teal200, teal500, teal700 } from 'material-ui/styles/colors';


 export default getMuiTheme({
   palette: {
     primary1Color: teal500,
     primary2Color: teal700,
     primary3Color: teal200,
   },
 }, {
   avatar: {
     borderColor: null,
   }
 });
