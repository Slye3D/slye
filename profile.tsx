/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2018 Parsa Ghadimi. All Rights Reserved.
 *       Licence: MIT License
 */

import React, { Component } from "react";
import { Img } from "./async";
import { Consumer } from "./context";
import { db } from "./fs";
import * as types from "./types";

// tslint:disable-next-line:variable-name
const Preview = ({ info, editable }) => (
  <div className="preview">
    <a href={ "#/view/" + info.id } >
      <Img src={ db.getThumbnailLink(info) } />
    </a>
    { !editable ? null : (
      <a href={ "#/editor/" + info.id } className="edit" />
    ) }
  </div>
);

interface ProfileState {
  isLoading: boolean;
  presentations: types.PresentationInfo[];
  user: types.User;
}

export class Profile extends Component<{}, ProfileState> {
  state = {
    isLoading: true,
    presentations: null,
    user: null
  };
  uid: string;

  async componentWillMount() {
    this.uid = (this.props as any).match.params.uid;
    const presentations = await db.queryProfile(this.uid);
    let user;
    if (presentations.length > 0) {
      user = presentations[0].data.owner;
    } else {
      // TODO Save users info in some document.
      // user = await db.getUser(uid);
    }
    this.setState({
      isLoading: false,
      presentations,
      user
    });
  }

  renderProfile(currentUser) {
    if (this.state.isLoading) {
      return <div className="loader" />;
    }
    const { presentations } = this.state;
    const currentUserProfile = currentUser && this.uid === currentUser.uid;
    let { user } = this.state;
    if (!user && currentUserProfile) {
      user = currentUser;
    }
    if (!user) {
      return <div>Not found</div>;
    }
    return (
      <div id="profile-page">
      <div className="user">
        <img src={ user.photoURL } />
        <h3>{ user.displayName }</h3>
      </div>
      <div className="list">
        { presentations.map(p => <Preview
          info={ p } key={ "p-" + p.id }
          editable={ currentUserProfile } />) }
        { presentations.length > 0 ? null : (
          "There is nothing in here!"
        ) }
      </div>
      </div>
    );
  }

  render() {
    return (
      <Consumer>
        {({values}) => this.renderProfile(values.Auth.currentUser)}
      </Consumer>
    );
  }
}
