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
import { connect } from "react-redux";
import * as db from "./db";
import * as types from "./types";

// tslint:disable-next-line:variable-name
const Preview = ({ info }) => (
  <div className="preview">
    <a href={ "#/view/" + info.id } >
      <img src={ info.thumbnail } />
    </a>
  </div>
);

interface ProfileProps {
  currentUser: types.User;
}

interface ProfileState {
  isLoading: boolean;
  presentations: types.PresentationInfo[];
  user: types.User;
}

class UserProfile extends Component<ProfileProps, ProfileState> {
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

  render() {
    if (this.state.isLoading) {
      return <div className="loader" />;
    }
    const { presentations } = this.state;
    const { currentUser } = this.props;
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
        { presentations.map(p => <Preview info={ p } key={ "p-" + p.id } />) }
        { presentations.length > 0 ? null : (
          "There is nothing in here!"
        ) }
      </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

// tslint:disable-next-line:variable-name
export const Profile = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
