/**
 * Created by xuzhida on 2017/12/21.
 */
require('normalize.css/normalize.css');
require('styles/App.css');
import React from 'react';

class GalleryComponent extends React.Component {
    render(){
        return (
            <div className="index">
                <div className="notice"><span>im gallery</span></div>
            </div>
        );
    }
}
GalleryComponent.defaultProps = {
};
export default GalleryComponent;
