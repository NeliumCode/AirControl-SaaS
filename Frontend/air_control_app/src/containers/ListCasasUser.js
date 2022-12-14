import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';

import '../styles/listCasasStyle.css';
import '../styles/notFoundStyle.css';

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
            // console.log(response);
            // console.log(response.data);
            document.querySelector('.houses-js').innerHTML = getListCasasHTML(response.data)
         })
    }


    // --- METHOD TO ITERATE CASAS LIST & SHOW THEM --- //

    const getListCasasHTML = (casas) => {
        let casasHTML = ''
      
        casas.forEach(casa => {
          casasHTML += '<tr><td>' + `<a href="casaDetails/` + casa.id + `">` + casa.name + '</a></td><td>' + casa.adress + '</td><td>' + casa.owner + '</td></tr>'
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
                    m??s relevantes de la misma. Adem??s si quieres conocer m??s detalles de la misma, simplemente accede
                    a cada una de ellas pulsando en el nombre de la casa.
                    </p>
                    <div className='row'>
                        <div className='column column--position-left'>
                            <div className='message--status-error'>
                                <strong> Antes de poder visualizar las casas debera iniciar sesi??n pulsando el siguiente bot??n. </strong>
                            </div>
                        </div>

                        <div className='column column--position-right'>
                            <Link className='btn btn-primary btn-lg' to='/login' role='button'>Iniciar Sesi??n</Link>    
                        </div>
                    </div>
                </div>
                <hr className='my-4' />

                <div id='notfound'>
                    <div className='notfound'>
                        <div className='notfound-404'>
                            <h1>Algo no funcion?? correctamente!</h1>
                        </div>
                        <h2>401 - No Autorizado</h2>
                        <p>La p??gina solicitada requiere permisos de usuario autenticado para poder ver su contenido.</p>
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
                    m??s relevantes de la misma. Adem??s si quieres conocer m??s detalles de la misma, simplemente accede
                    a cada una de ellas pulsando en el nombre de la casa.
                    </p>
                    <button onClick={getListCasasPerUser} className='btn btn-primary btn-lg mt-2'>Actualizar Casas</button>
                    <hr className='my-4' />
                </div>
                <div>
                    <table className='table table-hover table-bordered table--list-casas'>
                        <thead className='table-dark'>
                            <tr>
                                <th>Vivienda</th>
                                <th>Direcci??n</th>
                                <th>Propietario</th>
                            </tr>
                        </thead>
                        <tbody className='houses-js'></tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );


    // --- HTML CONTENT (VIEW) --- //

    return (
        <div>
            
            {isAuthenticated ? autenticados() : invitados()}

        </div>
    );
};

const mapStateToProps = state => ({
isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(ListCasasUser);