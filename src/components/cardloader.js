import React, { Component } from "react";
import "../styles/cardloader.scss";

export default class CardLoader extends Component {
  render() {
    if (!this.props.loading) {
      return null;
    }
    var cardList = [];
    for (let i = 0; i < this.props.num; i++) {
      cardList.push(<div className="cardSkeleton" key={i}></div>);
    }
    return <div className="cardLoader">{cardList}</div>;
  }
}
