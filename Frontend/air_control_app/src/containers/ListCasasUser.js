import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';
import '../styles/listCasasStyle.css';

const ListCasasUser = ({ isAuthenticated }) => {


    // --- JWT CREDENTIALS RETRIEVE --- //

    var accessToken = localStorage.getItem('access');


    // --- METHOD TO RETRIEVE A LIST OF CASAS PER USER --- //

    const getListCasasPerUser = () => {


        // --- HEADERS POSTGRES DATABASE API REQUESTS --- //

        const headersPostgresDB = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + accessToken
            }
        };


        // --- BACKEND API REQUESTS --- //

        Axios.get('http://localhost:8080/http://backend:8000/api/v1/casasUser', headersPostgresDB).then(response => { 
            console.log(response);
            document.querySelector('.houses-js').innerHTML = getListCasasHTML(response.data)
         })
    }


    // --- METHOD TO ITERATE CASAS LIST & SHOW THEM --- //

    const getListCasasHTML = (casas) => {
        let casasHTML = ''
      
        casas.forEach(casa => {
          casasHTML += `<a href="http://localhost:3000/casaDetails/` + casa.id + `">` + '<li>' + '<b>' + casa.name + ': ' + '</b>' + casa.adress + '</li>' + '</Link>'
        })
        return casasHTML
      }


    // --- AUTO-CALL FUNCTION WHEN RENDERS THE PAGE --- //

    useEffect(() => { getListCasasPerUser() 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // --- CONTENT DEPENDING ON AUTHENTICATED CHECK --- //

    const invitados = () => (
        <Fragment>
            <div className='container'>
                <div className='jumbotron mt-5'>
                    <h1 className='display-4'>Tus Casas</h1>
                    <p className='lead'>Te mostramos un listado con todas tus casas, donde podras ver los detalles 
                    más relevantes de la misma. Además si quieres conocer más detalles de la misma, simplemente accede
                    a cada una de ellas pulsando en el nombre de la casa.
                    </p>
                    <div className='row'>
                        <div className='column' id='column_left'>
                            <div className='alert_danger'>
                                <strong> Antes de poder visualizar las casas debera iniciar sesión pulsando el siguiente botón. </strong>
                            </div>
                        </div>

                        <div className='column' id='column_right'>
                            <Link className='btn btn-primary btn-lg' to='/login' role='button'>Iniciar Sesión</Link>    
                        </div>
                    </div>
                </div>
                <hr classNameName='my-4' />

                <div id='notfound'>
                    <div className='notfound'>
                        <div className='notfound-404'>
                            <h1>Algo no funcionó correctamente!</h1>
                        </div>
                        <h2>401 - No Autorizado</h2>
                        <p>La página solicitada requiere permisos de usuario autenticado para poder ver su contenido.</p>
                        <Link className='btn btn-primary btn-lg' to='/' role='button'>Ir a Home</Link>
                    </div>
                </div>
            </div>
        </Fragment>
    );

    const autenticados = () => (
        <Fragment>
            <div className='container'>
                <div className='jumbotron mt-5'>
                    <h1 className='display-4'>Tus Casas</h1>
                    <p className='lead'>Te mostramos un listado con todas tus casas, donde podras ver los detalles 
                    más relevantes de la misma. Además si quieres conocer más detalles de la misma, simplemente accede
                    a cada una de ellas pulsando en el nombre de la casa.
                    </p>
                    <button onClick={getListCasasPerUser} className='btn btn-primary btn-lg mt-2'>Actualizar Casas</button>
                    <hr classNameName='my-4' />
                </div>
                <div class='houses-js'>
                </div>
            </div>
        </Fragment>
    );


    // --- HTML CONTENT (VIEW) --- //

    return (
        <div id='Analiticas'>
            
            {isAuthenticated ? autenticados() : invitados()}

        </div>
    );
};

const mapStateToProps = state => ({
isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(ListCasasUser);