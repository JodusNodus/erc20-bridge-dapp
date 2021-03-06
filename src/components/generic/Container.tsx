import * as React from 'react';

import './Container.css';

const Container = ({ children, className }: any) => (
    <div className={"container shadow-lg Container " + className}>
        {children}
    </div>
)
export default Container;