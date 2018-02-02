import React  from 'react';
import Main from './main';
import Header from './common/header';

class App extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <Header />
                <Main />
            </div>
        );
    }
}

export default App;
