import React from "react";

function Title(props) {
  return (
    <div className="title-area">
      <h1>{props.title}</h1>
      <div className="article-content-meta">
        <div className="author-area">
          <div className="tag">Author</div>
          <a href="#" className="author-na">
            {props.author}
          </a>
        </div>
        <div className="created-area">
          <div className="tag">Created</div>
          <time>{props.created}</time>
        </div>
        <div className="created-area">
          <div className="tag">Updated</div>
          <time>{props.updated}</time>
        </div>
      </div>
    </div>
  );
}

export default Title;
