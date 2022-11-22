import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import Alert from './Alert';
import '../styles/navbarStyle.css';
import neliumImage from '../assets/NeliumTransparente.jpeg';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ logout, isAuthenticated }) => {


    // --- RESPONSIVE STATES --- //

    const [responsiveLinks, setResponsiveLinks] = useState(false);


    // --- CLOSE SESSION FUNCTION --- //

    const cierreSesion = () => {
        logout();
        setResponsiveLinks(false);
    };


    // --- LINKS AUTHENTICATED-BASED --- //

    const linksInvitados = () => (

        <Fragment>
            <Link to='/login' onClick={() => setResponsiveLinks(false)}>Iniciar Sesión</Link>
            <Link to='/signup' onClick={() => setResponsiveLinks(false)}>Resgistrarse</Link>
        </Fragment>

        /*<Fragment>
            <li className='nav-item'>
                <Link className='nav-link' to='/login'>Iniciar Sesión</Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='/signup'>Resgistrarse</Link>
            </li>
        </Fragment>*/
    );

    const linksAutenticados = () => (

        <Fragment>
            <Link to='/listCasasUser' onClick={() => setResponsiveLinks(false)}>Casas</Link>
            <Link to='/' onClick={cierreSesion}>Cerrar Sesión</Link>
        </Fragment>

    );


    // --- HTML CONTENT --- //

    return (

        <Fragment>
            <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'></link>
            <div className='navbar'>
                <div className='leftSide'>
                    <div className='neliumLink'>
                        <Link to='/' onClick={() => setResponsiveLinks(false)}><img src={neliumImage} alt='Nelium Analytics' width='232px' height='34px'/></Link>
                    </div>
                </div>
                <div className='middleSide'>
                    <div className='links' id={responsiveLinks ? 'hidden' : ''}>
                        <Link to='/' onClick={() => setResponsiveLinks(false)}> Home </Link>
                        {isAuthenticated ? linksAutenticados() : linksInvitados()}
                    </div>
                    <button onClick={() => setResponsiveLinks(!responsiveLinks)}> <MenuIcon /> </button>
                </div>
            </div>
            <Alert />
        </Fragment>
    );        
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(Navbar);