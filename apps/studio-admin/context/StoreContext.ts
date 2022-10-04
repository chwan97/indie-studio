import React from 'react';
import MainStore from 'store';

const StoreContext = React.createContext<MainStore | null>(null);
export default StoreContext;
