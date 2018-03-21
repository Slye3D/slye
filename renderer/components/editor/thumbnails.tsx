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

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';
import 'jquery.nicescroll';
import Paper from 'material-ui/Paper';
import { Renderer, Navigation, Events, Fileformat } from 'SDK/API';

import 'src/css/Thumbnail.css';

const thumbnailsCache	= {};
global.__thumbnailsCache__ = thumbnailsCache;
function newStep(i) {
  const stepUUID = Fileformat.Steps.createStep();
  Fileformat.Path.add2Path(stepUUID, i);
}

class Thumbnail extends Component {
  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  constructor(props) {
    super(props);
    Renderer.Thumbnails.init(props.uuid);
    Renderer.Thumbnails.setThumbnailsSize(80, 50, 15);
    this.state = {
      selectedStep: Navigation.current
    };
    Events.on(['currentStepChanged', 'pathChanged'], () => {
      if (!this._ismounted) { return; }
      this.setState({
        selectedStep: Navigation.current
      });
      // this.forceUpdate()
      // Commented because setState will call it
    });
  }

  onClick = (id) => () => {
    Navigation.goToPathId(id);
  }

  render() {
    const id = Fileformat.Path.getPath().indexOf(this.props.uuid);
    const className = ['thumbnail', id === this.state.selectedStep ? 'selected' : ''].join(' ');
    return (
      <div
        className={className}
        onClick={this.onClick(id)}
        ref={(el) => Renderer.Thumbnails.setDom(this.props.uuid, el)}
        x={this.props.uuid}
      >
        <div className="num">
          {id + 1}
        </div>
        <div className="add" onClick={() => newStep(id)} />
      </div>
    );
  }
}

class Thumbnails extends Component {
  state = {
    isThumbnailsOpen: false
  }

  toggleThumbnails = () => {
    const newState = !this.state.isThumbnailsOpen;
    if (newState) {
      Renderer.Thumbnails.enableRenderer();
    } else {
      Renderer.Thumbnails.disableRenderer();
    }
    this.setState({
      isThumbnailsOpen: newState
    });
  }

  niceScroll = (el) => {
    this.wrapper = el;
    this.setSize();
    if (!el) { return; }
    Renderer.Thumbnails.setWrapperDom(el);
    $(findDOMNode(el)).niceScroll();
  }

  setSize = () => {
    if (!this.wrapper) { return; }
    let width	= this.wrapper.offsetWidth,
      height	= this.wrapper.offsetHeight;
    Renderer.Thumbnails.setWrapperSize(width, height);
  }

  constructor() {
    super();
    Events.on('pathChanged', () => {
      this.forceUpdate();
    });
    window.addEventListener('resize', this.setSize);
  }

  render() {
    const thumbs	= [];
    Fileformat.Path.getPath().map((stepUUID, id) => {
      if (!thumbnailsCache[stepUUID]) { thumbnailsCache[stepUUID] = <Thumbnail key={stepUUID} uuid={stepUUID} />; }
      thumbs.push(thumbnailsCache[stepUUID]);
    });
    const Canvas	= Renderer.Thumbnails.getThumbnailCanvas();
    return (
      <Paper
        className={this.state.isThumbnailsOpen ? 'open' : 'close'}
        id="thumbnails-wrapper"
        zDepth={3}
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.19) 0px -10px 30px, rgba(0, 0, 0, 0.23) 0px -6px 10px'
        }}
        onMouseEnter={() => Renderer.Thumbnails.enableRenderer()}
        onMouseLeave={() => !this.state.isThumbnailsOpen && Renderer.Thumbnails.disableRenderer()}
      >
        <div ref={(el) => el && el.prepend(Canvas)}>
          <div id="thumbnails-list" ref={this.niceScroll}>
            {thumbs}
            <div className="add" onClick={() => newStep()} />
          </div>
        </div>
        <div onClick={this.toggleThumbnails} className="toogleThumb" />
      </Paper>
    );
  }
}

export default Thumbnails;
