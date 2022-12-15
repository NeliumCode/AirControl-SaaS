import React, { useEffect, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Chart } from 'chart.js/auto';
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

        // --- SETTING CASA ID TO CONSTANT --- //

        const casaId = id;

        // --- BACKEND API REQUESTS --- //

        Axios.get('http://localhost:8080/http://backend:8000/api/v1/casaDetailsUser/' + casaId, headersPostgresDB).then(response => {
            document.querySelector('.houseDetails-js').innerHTML = getCasaDetailsHTML(response.data);
            retrieveInfluxData(response.data.devices);
         })
    }


    // --- METHOD TO GENERATE SHOW CASA DETAILS  --- //

    const getCasaDetailsHTML = (casa) => {
        let casaDetailsHTML = ''
      
        casaDetailsHTML +=  '<div className="jumbotron mt-5">' +
                                '<h1 className="display-6">Detalles' + casa.name + '</h1>' +
                                
                                '<div className="row">' +
                                    '<div className="col-6">' +
                                        '<div id="normalData">' + 
                                            '<p><strong> Dirección: </strong>' + casa.adress + '</p>' +
                                        '</div>' +
                                    '</div>' +
                                
                                    '<div className="col-6">' +
                                        '<div id="normalData">' +
                                            '<p><strong> Propietario: </strong>' + casa.owner + '</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +

                                '<div className="row">' +
                                    '<div className="col-6">' +
                                        '<div id="normalData">' +
                                            '<p><strong> Latitud: </strong>' + casa.latitude + '</p>' +
                                        '</div>' +
                                    '</div>' +

                                    '<div className="col-6">' +
                                        '<div id="normalData">' +
                                            '<p><strong> Longitud: </strong>' + casa.longitude + '</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'

        return casaDetailsHTML
    }


    // --- METHOD TO RETRIEVE DATA FOR EACH EXISTING DEVICE IN CASA--- //

    const retrieveInfluxData = (devices) => {

        // --- API REQUEST PARAMETERS INICIALIZATION --- //

        const requestedRange = '-24h';

        const filterField = 'temp';

        // --- HEADERS INFLUXDB API REQUESTS --- //

        const headersInfluxDB = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + accessToken
            }
        };

        devices.forEach((device) => {
            
            // --- INFLUXDB API REQUESTS --- //

            Axios.get('http://localhost:8080/http://backend:8000/api/v1/influxRequest/' + requestedRange + '/' + device.deviceId + '/' + filterField, headersInfluxDB).then(response => { 
                console.log(response.data);
                poblateCharts(response.data, device.deviceId);
            })
        })
    }


    // --- METHOD TO GENERATE AND POBLATE CHARTS WITH DATA --- //

    const poblateCharts = (listData, deviceId) => {
        document.querySelector('.deviceTemps-js').insertAdjacentHTML('beforeend', '</br>' + 
                                                                                  '<div style="width: 80%;">' +
                                                                                  '<canvas id="myChart' + deviceId + '" width="300" height="150">' +
                                                                                  '</canvas></div>');
        let ctx = document.getElementById('myChart' + deviceId).getContext('2d');
        console.log(ctx)

        new Chart(ctx,{
            type: 'line',
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Device ' + deviceId,
                        position: 'top'
                    },
                    legend: { display: false },
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    y: {
                        suggestedMin: 10,
                        suggestedMax: 30,
                    }
                }
            },

            data: {
                labels: [
                    '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h',
                    '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h',
                ],
                
                datasets: [
                    { label: 'Temperaturas',
                    data: listData,
                    borderColor: 'black',
                    backgroundColor: 'rgba(54, 162 ,235, 0.5)',
                    borderWidth: 1,
                    fill: true,
                    tension: 0.25,
                    }
                ]
            },
        });
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
                <br/>
                <div class='houseDetails-js'></div>
                <br/>
                <br/>
                <br/>
                <h4 >
                    <b>Temperatura dispositivos</b>
                </h4>
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