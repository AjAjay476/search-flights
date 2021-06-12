import React from 'react';

export default (props) => {
  return (
    <div
      className="ag-overlay-loading-center"
      style={{ backgroundColor: 'bisque', height: '2rem', width: '48rem',
      color: 'black',
      fontWeight: 'bold',
      fontSize: 'initial'
    }}
    >
      <i className="far fa-frown"> {props.noRowsMessageFunc()}</i>
    </div>
  );
};