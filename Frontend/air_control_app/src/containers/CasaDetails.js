import React, { useEffect, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';
import '../styles/listCasasStyle.css';

const CasaDetails = ({ isAuthenticated }) => {


    // --- JWT CREDENTIALS RETRIEVE --- //

    var accessToken = localStorage.getItem('access');


    // --- METHOD TO RETRIEVE CASA DETAILS PER ID --- //

    const getCasaDetailsPerId = (id) => {


        // --- HEADERS POSTGRES DATABASE API REQUESTS --- //

        const headersPostgresDB = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + accessToken
            }
        };

        const casaId = id;


        // --- BACKEND API REQUESTS --- //

        Axios.get('http://localhost:8080/http://backend:8000/api/v1/casaDetailsUser/' + casaId, headersPostgresDB).then(response => { 
            // console.log(response);
            // console.log(response.data);
            // console.log(response.data.devices);
            document.querySelector('.houseDetails-js').innerHTML = getCasaDetailsHTML(response.data);
            retrieveInfluxData(response.data.devices);
         })
    }


    // --- METHOD TO GENERATE SHOW CASA DETAILS  --- //

    const getCasaDetailsHTML = (casa) => {
        let casaDetailsHTML = '<h3><b> Detalles Casa </b></h3></br>'
      
        casaDetailsHTML +=  '<li> <b> Nombre: </b>' + casa.name + '</li>' + 
                            '<li> <b> Dirección: </b>' + casa.adress + '</li>' +
                            '<li> <b> Propietario: </b>' + casa.owner + '</li>' +
                            '<li> <b> Latitud: </b>' + casa.latitude + '</li>' +
                            '<li> <b> Longitud: </b>' + casa.longitude + '</li>';

        return casaDetailsHTML
      }

    
    // --- METHOD TO ITERATE DEVICES LIST & SHOW THEM  --- //

    // const getListDevicesHTML = (devices) => {
    //     let devicesHTML = '<h3><b> Devices </b></h3></br>'

    //     devices.forEach(device => {
    //         devicesHTML += '<li>' + '<b>' + device.versions + ': ' + '</b>' + device.deviceId + ', ' + device.online + '</li>';
    //     })
    //     // console.log(devicesHTML);
    //     return devicesHTML
    //   }


    // --- METHOD TO RETRIEVE DATA FOR EACH EXISTING DEVICE IN CASA--- //

    const retrieveInfluxData = (devices) => {

        // --- API REQUEST PARAMETERS INICIALIZATION --- //

        const requestedRange = '-48h';

        const filterField = 'temp';

        // --- HEADERS INFLUXDB API REQUESTS --- //

        const headersInfluxDB = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + accessToken
            }
        };

        devices.forEach(device => {
            
            // --- INFLUXDB API REQUESTS --- //

            Axios.get('http://localhost:8080/http://backend:8000/api/v1/influxRequest/' + requestedRange + '/' + device.deviceId + '/' + filterField , headersInfluxDB).then(response => { 
                console.log(response.data);
                document.querySelector('.deviceTemps-js').innerHTML = getTempsPerDevice(response.data);
            })
            
        })
    }


    // --- METHOD TO SHOW TEMP => (NEXT) => GENERATE GRAPH WITH TEMP DATA --- //

    const getTempsPerDevice = (listData) => {
        let dataHTML = '<h3><b> Temperatura </b></h3></br>'
      
        listData.forEach(data => {
            console.log(data);
            if (data.temp){
                dataHTML += '<li><b>' + data.temp + '</b></li>'
            }
            else if (data.pres){
                dataHTML += '<li><b>' + data.pres + '</b></li>'
            }
        })
        return dataHTML
    }


    // --- ASSIGNING ID PARAM FROM URL --- //

    const { id } = useParams();


    // --- AUTO-CALL FUNCTION WHEN RENDERS THE PAGE --- //

    useEffect(() => { getCasaDetailsPerId(id) // ID automatizado para matchear con el de la URL.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // --- CONTENT DEPENDING ON AUTHENTICATED CHECK --- //

    const invitados = () => (
        <Fragment>
            <div className='container'>
                <div className='jumbotron mt-5'>
                    <h1 className='display-4'>Detalles Casa</h1>
                    <p className='lead'>Te mostramos los datos específicos de una casa, además podrás encontrar los datos
                    de los sensores representados en una gráfica.
                    </p>
                    <div className='row'>
                        <div className='column' id='column_left'>
                            <div className='alert_danger'>
                                <strong> Antes de poder visualizar los detalles de la casa debera iniciar sesión pulsando el 
                                siguiente botón. 
                                </strong>
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
                    <h1 className='display-4'>Detalles Casa</h1>
                    <p className='lead'>Te mostramos los datos específicos de una casa, además podrás encontrar los datos
                    de los sensores representados en una gráfica.
                    </p>
                    <Link className='btn btn-primary btn-lg mt-2' to='/listCasasUser' role='button'>Volver</Link>
                    <hr classNameName='my-4' />
                </div>
                <div class='houseDetails-js'></div>
                <br/>
                <br/>
                <div class='deviceTemps-js'></div>
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

export default connect(mapStateToProps)(CasaDetails);